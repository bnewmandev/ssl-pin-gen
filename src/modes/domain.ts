import { generateOutputFromCertArray, getCertFromHost } from "../utils.js";

const runDomain = async (domain?: string) => {
  if (!domain) {
    throw new Error("Requires domain to be passed");
  }
  console.log(generateOutputFromCertArray(await getCertFromHost(domain)));
};

export default runDomain
