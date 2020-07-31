import { CliPrettify } from "./cliPrettify";
import { InputReader } from "./inputReader";

InputReader.subscribe(input => process.stdout.write(CliPrettify.prettify(input)));