var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from 'fs/promises';
import { createHash, X509Certificate } from 'crypto';
import { request } from 'https';
const requestAsync = (options) => {
    return new Promise((resolve, reject) => {
        const req = request(options, ((res) => {
            resolve(res.socket);
        }));
        req.end();
    });
};
export const getCertFromHost = (host) => __awaiter(void 0, void 0, void 0, function* () {
    const socket = yield requestAsync({ host, port: 443 });
    const peerCert = socket.getPeerCertificate(true);
    const certChain = [];
    let checkCert = peerCert;
    while (true) {
        certChain.push({ x509: new X509Certificate(checkCert.raw), cn: checkCert.subject.CN });
        if (checkCert.fingerprint === checkCert.issuerCertificate.fingerprint || !checkCert.issuerCertificate)
            break;
        checkCert = checkCert.issuerCertificate;
    }
    return certChain;
});
const certRe = /(-----BEGIN CERTIFICATE-----(?:[\s\S]*?)-----END CERTIFICATE-----)/g;
const cnRe = /(?<=CN=).*/g;
export const extractCertsFromPemString = (pemString) => {
    const certificates = pemString.match(certRe);
    if (!certificates) {
        throw new Error("Error reading certificate chain");
    }
    return certificates.map((cert) => {
        const x509 = new X509Certificate(cert);
        const cnMatch = x509.subject.match(cnRe);
        const cn = cnMatch ? cnMatch[0] : "CN Not found in subject";
        return { x509, cn };
    });
};
export const readPemFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield readFile(path)).toString();
    }
    catch (error) {
        throw new Error(`Error reading file: ${path}`);
    }
});
export const pinFromX509Cert = (cert) => {
    const pubkey = cert.publicKey.export({ format: 'der', type: 'spki' });
    return createHash('sha256').update(pubkey).digest().toString('base64');
};
export const generateOutputFromCertArray = (certs) => {
    return certs.map(({ x509, cn }) => (cn || 'UNKNOWN') + ' - ' + pinFromX509Cert(x509)).join('\n');
};
