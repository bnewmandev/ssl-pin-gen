var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config.js";
import * as https from 'https';
import { X509Certificate, createHash } from 'node:crypto';
import { Menu } from "./Menu.js";
import { formatPinOut, generateChainData, getCertFromDomain, readPemFile } from "./utils.js";
const domainOptions = process.env['DOMAIN_OPTIONS'];
const fromDomain = {
    title: 'Generate from a domain',
    context: domainOptions ? undefined : {
        default: 'google.com',
        prompt: 'Enter a domain (google.com): '
    },
    run: () => __awaiter(void 0, void 0, void 0, function* () {
        const runner = (domain) => __awaiter(void 0, void 0, void 0, function* () {
            // console.clear()
            console.log(formatPinOut(yield generateChainData(yield getCertFromDomain(domain))));
        });
        if (domainOptions) {
            const options = domainOptions.split(',').map((option) => ({
                title: option,
                run: () => runner(option)
            }));
            options.push({
                title: 'Other Domain',
                context: {
                    prompt: 'Enter a domain (google.com): ',
                    default: 'google.com'
                },
                run: (context) => runner(context)
            });
            new Menu({ prompt: 'Select a domain', items: options }).run();
        }
    })
};
const fromB64File = {
    title: 'Generate from Base64 certificate chain (*.pem | *.crt)',
    context: {
        prompt: "Enter path to certificate (./cert.pem): ",
        default: './cert.pem',
    },
    run: (context) => __awaiter(void 0, void 0, void 0, function* () {
        console.clear();
        formatPinOut(yield generateChainData(yield readPemFile(context)));
    })
};
const req = https.request({ host: 'uat-external-api.howdens.com', port: 443 }, (res) => {
    const socket = res.socket;
    const baseDerCert = socket.getPeerCertificate(true);
    const certDepth0 = new X509Certificate(baseDerCert.raw);
    const certDepth1 = new X509Certificate(baseDerCert.issuerCertificate.raw);
    const certDepth2 = new X509Certificate(baseDerCert.issuerCertificate.issuerCertificate.raw);
    const hash = createHash('sha256');
    const pubkey = certDepth0.publicKey.export({ format: 'der', type: 'spki' });
    // const pubkey = certDepth0.publicKey.export({format: 'pem', type: 'pkcs1'} as KeyExportOptions<'pem'>)
    console.log(pubkey);
    hash.update(pubkey);
    const hashedPubkey = hash.digest();
    // console.log(publicEncrypt())
    console.log(hashedPubkey.toString('base64'));
});
req.end();
