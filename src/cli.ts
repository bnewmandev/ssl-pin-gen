#! /usr/bin/env node

import runDomain from "./modes/domain.js";
import runInteractive from "./modes/interactive.js";
import runLocal from "./modes/local.js";

import { Command } from "@commander-js/extra-typings";


const program = new Command();

program
  .name('ssl-pin-gen')
  .description('Generate SSL pins from domain or base64 certificate chain')
  .option('--json', 'output as json')
  .option('--prefix <string>', 'change output prefix (no effect with --json)')
  .action((options) => {
    runInteractive(options);
  })
  .addHelpCommand();

program.command('domain')
  .description('Generate pins from given domain')
  .argument('<domain>', 'domain from which to pull certificate chain')
  .action((domain, _, command) => {
    runDomain({domain, opts: command.optsWithGlobals()})
  });
  
program.command('file')
  .description('Generate pins from given base64 certificate chain file')
  .argument('<file>', 'domain from which to pull certificate chain')
  .action((file, _, command) => {
    runLocal({path: file, opts: command.optsWithGlobals()})
  });

program.parse()
