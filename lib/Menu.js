var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createInterface, emitKeypressEvents } from "readline";
import { Colors } from "./types.js";
export class Menu {
    constructor(props) {
        this.index = 0;
        this.items = props.items;
        this.prompt = props.prompt;
    }
    color(text, color) {
        return `${color || Colors.RESET}${text}${Colors.RESET}`;
    }
    renderMenu() {
        console.clear();
        console.log(this.color(this.prompt, Colors.BLUE));
        this.items.forEach((item, i) => {
            console.log(i === this.index
                ? this.color(`→ ${item.title}`, Colors.GREEN)
                : `  ${item.title}`);
        });
    }
    inputText(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            return new Promise((res) => {
                rl.question(prompt, (ans) => {
                    rl.close();
                    res(ans);
                });
            });
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                const handleKeyPress = (str, key) => __awaiter(this, void 0, void 0, function* () {
                    if (key.name === 'up') {
                        this.index =
                            this.index > 0
                                ? this.index - 1
                                : this.items.length - 1;
                    }
                    else if (key.name === 'down') {
                        this.index =
                            this.index < this.items.length - 1
                                ? this.index + 1
                                : 0;
                    }
                    else if (key.name === 'return') {
                        const currentItem = this.items[this.index];
                        process.stdin.setRawMode(false);
                        process.stdin.removeListener('keypress', handleKeyPress);
                        console.clear();
                        if (currentItem.context) {
                            const context = yield this.inputText(currentItem.context.prompt);
                            return yield currentItem.run(context === '' ? currentItem.context.prompt : context);
                        }
                        return yield currentItem.run();
                    }
                    else if (key.name === 'c' && key.ctrl)
                        process.exit(0);
                    this.renderMenu();
                });
                emitKeypressEvents(process.stdin);
                process.stdin.setRawMode(true);
                process.stdin.on('keypress', handleKeyPress);
                this.renderMenu();
            }));
        });
    }
}
