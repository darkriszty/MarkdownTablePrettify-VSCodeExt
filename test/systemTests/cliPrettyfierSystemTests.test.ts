import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import { CliPrettify } from '../../cli/cliPrettify';

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests - prettyfied input files match prepared expected files", () => {
        const distinctTests: string[] = getTestFileNames(files);
        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const input = fs.readFileSync(pathFor(`${fileNameRoot}-input.md`), "utf8");
                const expected = fs.readFileSync(pathFor(`${fileNameRoot}-expected.md`), "utf8");

                const actual = CliPrettify.prettify(input);

                assert.strictEqual(actual, expected);
            });
        }
    });
});

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests - check() for non pretty files throws error", () => {
        const distinctTests: string[] = getTestFileNames(files);
        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const input = fs.readFileSync(pathFor(`${fileNameRoot}-input.md`), "utf8");
                assert.throws(() => CliPrettify.check(input));
            });
        }
    });
});


fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests - check() for pretty files does not throw", () => {
        const distinctTests: string[] = getTestFileNames(files);
        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const expected = fs.readFileSync(pathFor(`${fileNameRoot}-expected.md`), "utf8");
                assert.doesNotThrow(() => CliPrettify.check(expected));
            });
        }
    });
});

function getTestFileNames(files: string[]): string[] {
    const blockListFileName = "_cli-blocklist.config";
    const blockedFiles: string[] = files.find(f => f === blockListFileName)
        ? fs.readFileSync(pathFor(blockListFileName), "utf8").split(/\r\n|\r|\n/)
        : [];

    const distinctTests: string[] = files
        .filter(f => path.extname(f).toLowerCase() === ".md")
        .filter(f => blockedFiles.indexOf(f) < 0)
        .map(f => f.split("-")[0]).filter((item, i, s) => s.lastIndexOf(item) == i);
    return distinctTests;
}

function pathFor(fileName: string): string {
    return path.resolve(__dirname, `resources/${fileName}`);
}