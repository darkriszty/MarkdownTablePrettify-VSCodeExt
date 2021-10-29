#!/usr/bin/env node

import { parseArguments } from "./argumentsParser";
import { CliOptions } from "./cliOptions";
import { CliPrettify } from "./cliPrettify";
import { InputReader } from "./inputReader";

const cliOptions: CliOptions = parseArguments(process.argv);

InputReader.subscribe(input =>
    cliOptions.check
        ? CliPrettify.check(input, cliOptions)
        : process.stdout.write(CliPrettify.prettify(input, cliOptions))
);