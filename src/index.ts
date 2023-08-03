import "dotenv/config.js"
import * as https from 'https'
import {TLSSocket} from 'node:tls'
import {X509Certificate, createHash} from 'node:crypto'

import { Menu } from "./Menu.js";
import { MenuItem } from "./types.js";
import { formatPinOut, generateChainData, getCertFromDomain, readPemFile } from "./utils.js";
import { KeyExportOptions, publicEncrypt } from "crypto";


const domainOptions = process.env['DOMAIN_OPTIONS'];




const fromDomain: MenuItem = {
  title: 'Generate from a domain',
  context: domainOptions ? undefined : {
    default: 'google.com',
    prompt: 'Enter a domain (google.com): '
  },
  run: async () => {
    const runner = async (domain: string): Promise<void> => {
      // console.clear()
      console.log(formatPinOut(await generateChainData(await getCertFromDomain(domain))))
    }

    if (domainOptions) {
      const options = domainOptions.split(',').map((option) => ({
        title: option,
        run: () => runner(option)
      } as MenuItem))

      options.push({
        title: 'Other Domain',
        context: {
          prompt: 'Enter a domain (google.com): ',
          default: 'google.com'
        },
        run: (context) => runner(context!)
    })
      
      new Menu({prompt: 'Select a domain', items: options}).run()
    }
  }
}

const fromB64File: MenuItem = {
  title: 'Generate from Base64 certificate chain (*.pem | *.crt)',
  context: {
    prompt: "Enter path to certificate (./cert.pem): ",
    default: './cert.pem',
  },
  
  run: async (context) => {
    console.clear()
    formatPinOut(await generateChainData(await readPemFile(context!)))
  }
}

// new Menu({prompt: 'Select certificate generation method', items: [fromDomain, fromB64File]}).run()

interface Cert {
  name: string;
  x509: string;
}

const req = https.request({host: 'uat-external-api.howdens.com', port: 443 }, (res) => {
  const socket = res.socket as TLSSocket;
  const baseDerCert = socket.getPeerCertificate(true)

  

  const certDepth0 = new X509Certificate(baseDerCert.raw)
  const certDepth1 = new X509Certificate(baseDerCert.issuerCertificate.raw)
  const certDepth2 = new X509Certificate(baseDerCert.issuerCertificate.issuerCertificate.raw)

  const hash = createHash('sha256');

  const pubkey = certDepth0.publicKey.export({format: 'der', type: 'spki'} as KeyExportOptions<'der'>)
  // const pubkey = certDepth0.publicKey.export({format: 'pem', type: 'pkcs1'} as KeyExportOptions<'pem'>)


  console.log(pubkey)

  hash.update(pubkey);
  const hashedPubkey = hash.digest();

  // console.log(publicEncrypt())

  console.log(hashedPubkey.toString('base64'))
})


req.end()
