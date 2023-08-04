import {
  extractCertsFromPemString,
  generateOutputFromCertArray,
  readPemFile,
} from "../utils.js";

const runLocal = async (path?: string) => {
  if (!path) {
    throw new Error("Requires file path to be passed");
  }
  console.log(
    generateOutputFromCertArray(
      extractCertsFromPemString(await readPemFile(path)),
    ),
  );
};

export default runLocal
