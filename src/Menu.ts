import { createInterface, Key, emitKeypressEvents } from "readline";
import { MenuItem, Colors, MenuProps } from "./types.js";


export class Menu {
  private index = 0;
  private items: MenuItem[];
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
          console.clear()

          if (currentItem.context) {
            const context = await this.inputText(
              currentItem.context.prompt,
            );
            return await currentItem.run(context === '' ? currentItem.context.prompt : context)
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
