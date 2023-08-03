export interface CertData {
  name: string;
  data: string;
}

export interface CertDataWithPin extends CertData {
  pin: string;
}

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
