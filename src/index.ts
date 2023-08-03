import { Menu, MenuItem } from "./Menu";

const testFuncOne: MenuItem = {
  title: 'Function One',
  contextPrompt: 'Please enter more details',
  default: 'more details',
  run: async () => {
    
  }
}

const testFuncTwo: MenuItem = {
  title: 'Function Two',
  contextPrompt: 'Please enter more details',
  default: 'more details',
  run: async () => {
    
  }
}

new Menu({items: [testFuncOne, testFuncTwo], prompt: 'make a selection'})
