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
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
const runCmd = (cmd) => __awaiter(void 0, void 0, void 0, function* () {
    const { stderr, stdout } = yield execAsync(cmd);
    if (stderr) {
        throw new Error(stdout + '\n\n' + stderr);
    }
    return stdout;
});
export const getCertFromDomain = (domain) => {
    return runCmd(`openssl s_client -showcerts -connect ${domain}:443`);
};
const certRe = /(-----BEGIN CERTIFICATE-----(?:[\s\S]*?)-----END CERTIFICATE-----)/g;
const certNameRe = /(?<=\d .*CN = )[^\r\n,]*/g;
export const extractCertsFromPemString = (pemString) => {
    const certificates = pemString.match(certRe);
    const certNames = pemString.match(certNameRe);
    if (!certificates || !certNames) {
        throw new Error("Error reading certificate chain");
    }
    return certificates.map((cert, i) => ({
        name: certNames[i].trim(),
        data: cert.trim(),
    }));
};
export const readPemFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield readFile(path)).toString();
});
export const generatePin = (certificate) => __awaiter(void 0, void 0, void 0, function* () {
    const pin = yield runCmd(`echo "${certificate}" | 
      openssl x509 -pubkey -noout | 
      openssl rsa -pubin -outform der 2>/dev/null |
      openssl dgst -sha256 -binary |
      openssl enc -base64`);
    return pin;
});
export const generateChainData = (pemString) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(extractCertsFromPemString(pemString).map((current) => __awaiter(void 0, void 0, void 0, function* () {
        return (Object.assign(Object.assign({}, current), { pin: (yield generatePin(current.data)).trim() }));
    })));
});
export const formatPinOut = (chainData) => {
    return chainData.map(({ pin, name }, i) => (`PUBLIC_KEY_HASH_DEPTH_${i}=${pin} # CN - ${name}`)).join('\n');
};
