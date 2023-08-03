import { createInterface, Key, emitKeypressEvents } from "readline";

export interface MenuItem<T = void> {
  title: string;
  contextPrompt?: string;
  default: string;
  run: (context?: string) => Promise<T>
}

interface MenuProps {
  items: MenuItem<any>[];
  prompt: string;
}

enum Colors {
  RESET = "\x1b[0m",
  BLUE = "\x1b[34m",
  GREEN = "\x1b[32m",
}

export class Menu {
  private index = 0;
  private items: MenuItem<any>[];
  private prompt: string;

  constructor(props: MenuProps) {
    this.items = props.items;
    this.prompt = props.prompt;
  }

  private color(text: string, color: Colors): string {
    return `${color || Colors.RESET}${text}${Colors.RESET}`;
  }

  private renderMenu(): void {
    console.clear();
    console.log(this.color(this.prompt, Colors.BLUE));
    this.items.forEach((item, i) => {
      console.log(
        i === this.index
          ? this.color(`→ ${item.title}`, Colors.GREEN)
          : `  ${item.title}`
      );
    });
  }

  private async inputText(prompt: string): Promise<string> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((res) => {
      rl.question(prompt, (ans: string) => {
        rl.close();
        res(ans);
      });
    });
  }

  async run(): Promise<MenuItem[ "run" ]> {
    return new Promise(async res => {
      const handleKeyPress = async (str: string, key: Key) => {
        if (key.name === 'up') {
          this.index =
            this.index > 0
              ? this.index - 1
              : this.items.length - 1;
        } else if (key.name === 'down') {
          this.index =
            this.index < this.items.length - 1
              ? this.index + 1
              : 0;
        } else if (key.name === 'return') {
          const currentItem = this.items[this.index]
          process.stdin.setRawMode(false);
          process.stdin.removeListener('keypress', handleKeyPress);

          if (currentItem.contextPrompt) {
            const context = await this.inputText(
              currentItem.contextPrompt,
            );
            return await currentItem.run(context === '' ? currentItem.default : context)
          }

          return await currentItem.run()

        } else if (key.name === 'c' && key.ctrl) process.exit(0);

        this.renderMenu();
      };

      emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.on('keypress', handleKeyPress);
      this.renderMenu();
    })
  }
}
