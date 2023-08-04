import {
  extractCertsFromPemString,
  generateOutputFromCertArray,
  readPemFile,
} from '../utils.js';

interface Props {
  path?: string;
  opts: {
    json: true | undefined;
    prefix: string | undefined;
  };
}

const runLocal = async ({ path, opts }: Props) => {
  if (!path) {
    throw new Error('Requires file path to be passed');
  }
  console.log(
    generateOutputFromCertArray(
      extractCertsFromPemString(await readPemFile(path)),
      opts.json,
      opts.prefix,
    ),
  );
};

export default runLocal;
