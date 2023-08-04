import { X509Certificate } from "node:crypto";


export interface MenuItem{
  title: string;
  context?: {
    prompt: string;
    default: string;
  }
  run: (context?: string) => void | Promise<void>
}

export interface MenuProps {
  items: MenuItem[];
  prompt: string;
}

export enum Colors {
  RESET = "\x1b[0m",
  BLUE = "\x1b[34m",
  GREEN = "\x1b[32m",
}

export interface CertificateWithSubject {
  x509: X509Certificate,
  cn: string
}

