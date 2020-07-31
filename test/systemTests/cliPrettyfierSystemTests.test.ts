import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import { CliPrettify } from '../../cli/cliPrettify';

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests", () => {
        let distinctTests: string[] = files.map(f => f.split("-")[0]).filter((item, i, s) => s.lastIndexOf(item) == i);

        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const input = fs.readFileSync(pathFor(`${fileNameRoot}-input.md`), "utf8");
                const expected = fs.readFileSync(pathFor(`${fileNameRoot}-expected.md`), "utf8");

                const actual = CliPrettify.prettify(input);

                assert.equal(actual, expected);
            });
        }

        function pathFor(fileName: string): string {
            return path.resolve(__dirname, `resources/${fileName}`);
        }
    });
});