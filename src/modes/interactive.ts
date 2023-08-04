import 'dotenv/config.js';

import { Menu } from '../Menu.js';
import { MenuItem } from '../types.js';
import {
  extractCertsFromPemString,
  generateOutputFromCertArray,
  getCertFromHost,
  readPemFile,
} from '../utils.js';

const domainOptions = process.env['DOMAIN_OPTIONS'];

interface Props {
  json?: true;
  prefix?: string;
}

const runInteractive = ({ json, prefix }: Props) => {
  const fromDomain: MenuItem = {
    title: 'Generate from a domain',
    context: domainOptions
      ? undefined
      : {
          default: 'google.com',
          prompt: 'Enter a domain (google.com): ',
        },
    run: async () => {
      const runner = async (domain: string): Promise<void> => {
        console.clear();
        console.log(
          generateOutputFromCertArray(
            await getCertFromHost(domain),
            json,
            prefix,
          ),
        );
        process.exit(0);
      };

      if (domainOptions) {
        const options = domainOptions.split(',').map(
          (option) =>
            ({
              title: option,
              run: () => runner(option),
            }) as MenuItem,
        );

        options.push({
          title: 'Other Domain',
          context: {
            prompt: 'Enter a domain (google.com): ',
            default: 'google.com',
          },
          run: (context) => runner(context!),
        });

        new Menu({ prompt: 'Select a domain', items: options }).run();
      }
    },
  };

  const fromBase64CertChain: MenuItem = {
    title: 'Generate from a Base 64 encoded certificate chain file',
    context: {
      prompt: 'Enter path to certificate (./cert.crt): ',
      default: './cert.crt',
    },

    run: async (context) => {
      console.clear();
      console.log(
        generateOutputFromCertArray(
          extractCertsFromPemString(await readPemFile(context!)),
          json,
          prefix,
        ),
      );
      process.exit(0);
    },
  };

  new Menu({
    prompt: 'Select certificate generation method',
    items: [fromDomain, fromBase64CertChain],
  }).run();
};

export default runInteractive;
