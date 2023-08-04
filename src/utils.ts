import { readFile } from 'fs/promises';
import {  createHash, KeyExportOptions, X509Certificate } from 'crypto';
import {request, RequestOptions} from 'https';
import { TLSSocket } from 'node:tls';
interface CertificateWithSubject {
  x509: X509Certificate,
  cn: string
}

const requestAsync = (options: RequestOptions) => {
  return new Promise<TLSSocket>((resolve, reject) => {
    const req = request(options, ((res) => {
      resolve(res.socket as TLSSocket)
    }))
    req.end()
  })
}


export const getCertFromHost = async (host:string) => {
  const socket = await requestAsync({host, port: 443})
  const peerCert = socket.getPeerCertificate(true);
  const certChain: CertificateWithSubject[] = [];
  let checkCert = peerCert;
  while (true) {
    certChain.push({x509: new X509Certificate(checkCert.raw), cn: checkCert.subject.CN});
    if (checkCert.fingerprint === checkCert.issuerCertificate.fingerprint || !checkCert.issuerCertificate) break;
    checkCert = checkCert.issuerCertificate;
  }
  return certChain
}


const certRe =
  /(-----BEGIN CERTIFICATE-----(?:[\s\S]*?)-----END CERTIFICATE-----)/g;

const cnRe = /(?<=CN=).*/g;

export const extractCertsFromPemString = (pemString: string): CertificateWithSubject[] => {
  const certificates = pemString.match(certRe);
  if (!certificates) {
    throw new Error("Error reading certificate chain")
  }
  return certificates.map((cert) => {
    const x509 = new X509Certificate(cert);
    const cnMatch = x509.subject.match(cnRe);
    const cn = cnMatch ? cnMatch[0] : "CN Not found in subject"

    return {x509, cn}
  })
};

export const readPemFile = async (path: string) => {
  try {
  return (await readFile(path)).toString();
  } catch (error) {
    throw new Error(`Error reading file: ${path}`)
  }
};

export const pinFromX509Cert = (cert: X509Certificate) => {
  const pubkey = cert.publicKey.export({format: 'der', type: 'spki'} as KeyExportOptions<'der'>)
  return createHash('sha256').update(pubkey).digest().toString('base64')
}

export const generateOutputFromCertArray = (certs: CertificateWithSubject[]) => {
  return certs.map(({x509, cn}) => (cn || 'UNKNOWN') + ' - ' + pinFromX509Cert(x509)).join('\n')
}
