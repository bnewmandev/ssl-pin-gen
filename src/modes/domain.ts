import { generateOutputFromCertArray, getCertFromHost } from '../utils';

interface Props {
  domain?: string;
  opts: {
    json: true | undefined;
    prefix: string | undefined;
  };
}

const runDomain = async ({ domain, opts }: Props) => {
  if (!domain) {
    throw new Error('Requires domain to be passed');
  }
  console.log(
    generateOutputFromCertArray(
      await getCertFromHost(domain),
      opts.json,
      opts.prefix,
    ),
  );
};

export default runDomain;
