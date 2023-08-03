var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Menu } from "./Menu/Menu.js";
const testFuncOne = {
    title: 'Function One',
    contextPrompt: 'Please enter more details',
    default: 'more details',
    run: () => __awaiter(void 0, void 0, void 0, function* () {
    })
};
const testFuncTwo = {
    title: 'Function Two',
    contextPrompt: 'Please enter more details',
    default: 'more details',
    run: () => __awaiter(void 0, void 0, void 0, function* () {
    })
};
new Menu({ items: [testFuncOne, testFuncTwo], prompt: 'make a selection' }).run();
