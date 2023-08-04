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
import { Menu } from "./Menu.js";
import { extractCertsFromPemString, generateOutputFromCertArray, getCertFromHost, readPemFile } from "./utils.js";
const domainOptions = process.env['DOMAIN_OPTIONS'];
const fromDomain = {
    title: 'Generate from a domain',
    context: domainOptions ? undefined : {
        default: 'google.com',
        prompt: 'Enter a domain (google.com): '
    },
    run: () => __awaiter(void 0, void 0, void 0, function* () {
        const runner = (domain) => __awaiter(void 0, void 0, void 0, function* () {
            console.clear();
            console.log(generateOutputFromCertArray(yield getCertFromHost(domain)));
            process.exit(0);
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
const fromBase64CertChain = {
    title: 'Generate from a Base 64 encoded certificate chain file',
    context: {
        prompt: "Enter path to certificate (./cert.crt): ",
        default: './cert.crt',
    },
    run: (context) => __awaiter(void 0, void 0, void 0, function* () {
        console.clear();
        console.log(generateOutputFromCertArray(extractCertsFromPemString(yield readPemFile(context))));
        process.exit(0);
    })
};
new Menu({ prompt: 'Select certificate generation method', items: [fromDomain, fromBase64CertChain] }).run();
// (async () => {
//   const certs = await getCertFromHost('uat-external-api.howdens.com');
//   console.log(generateOutputFromCertArray(certs))
// })()
