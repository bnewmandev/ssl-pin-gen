import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import { X509Certificate } from 'crypto';
import * as https from 'https';
import { TLSSocket } from 'node:tls';

const execAsync = promisify(exec);
const requestAsync = promisify(https.request);


const runCmd = async (cmd: string) => {
  const { stderr, stdout } = await execAsync(cmd);
  if (stderr) {
    throw new Error(stdout + '\n\n' + stderr);
  }
  return stdout;
};

export const getCertFromDomain = async (domain:string) => {
  const req = https.request({host: 'uat-external-api.howdens.com', port: 443 })
  const socket = req.socket as TLSSocket;
  const baseDerCert = socket.getPeerCertificate(true);
  console.log()
}


const certRe =
  /(-----BEGIN CERTIFICATE-----(?:[\s\S]*?)-----END CERTIFICATE-----)/g;

const certNameRe = /(?<=\d .*CN = )[^\r\n,]*/g;

export const extractCertsFromPemString = (pemString: string) => {
  const certificates = pemString.match(certRe);
  const certNames = pemString.match(certNameRe);
  if (!certificates || !certNames) {
    throw new Error("Error reading certificate chain")
  }
  return certificates.map((cert) => (new X509Certificate(cert)))
};

export const readPemFile = async (path: string) => {
  return (await readFile(path)).toString();
};

export const generatePin = async (certificate: string) => {
  const pin = await runCmd(
    `echo "${certificate}" | 
      openssl x509 -pubkey -noout | 
      openssl rsa -pubin -outform der 2>/dev/null |
      openssl dgst -sha256 -binary |
      openssl enc -base64`,
  );
  return pin;
};

export const generateChainData = async (pemString: string) => {
  return await Promise.all(
    extractCertsFromPemString(pemString).map(async (current) => ({
      ...current,
      pin: (await generatePin(current.data)).trim(),
    })),
  );
};

export const formatPinOut = (chainData: CertDataWithPin[]) => {
  return chainData.map(({pin, name}, i) => (`PUBLIC_KEY_HASH_DEPTH_${i}=${pin} # CN - ${name}`)).join('\n')
};
