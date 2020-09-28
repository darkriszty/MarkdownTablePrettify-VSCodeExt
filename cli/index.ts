import { CliPrettify } from "./cliPrettify";
import { InputReader } from "./inputReader";

const checkOnly = process.argv.length > 2 || process.argv.find(arg => arg === "--check");

InputReader.subscribe(input =>
    checkOnly
        ? CliPrettify.check(input)
        : process.stdout.write(CliPrettify.prettify(input))
);