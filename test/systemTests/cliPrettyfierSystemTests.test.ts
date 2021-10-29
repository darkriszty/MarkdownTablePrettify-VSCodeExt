import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import { getDistinctTestFileNames, readFileContents } from './systemTestFileReader';
import SystemTestsConfig from './systemTestsConfig';
import { CliPrettify } from '../../cli/cliPrettify';

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests - prettyfied input files match prepared expected files", () => {
        const distinctTests: string[] = getAllowedAndDistinctTestFileNames(files);
        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const input = readFileContents(`${fileNameRoot}-input.md`);
                const expected = readFileContents(`${fileNameRoot}-expected.md`);
                const cliOptions = SystemTestsConfig.getCliOptionsFor(fileNameRoot);

                const actual = CliPrettify.prettify(input, cliOptions);

                assert.strictEqual(actual, expected);
            });
        }
    });
});

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests - check() for non pretty files throws error", () => {
        const distinctTests: string[] = getAllowedAndDistinctTestFileNames(files);
        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const input = readFileContents(`${fileNameRoot}-input.md`);
                assert.throws(() => CliPrettify.check(input));
            });
        }
    });
});

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("CLI Prettyfier system tests - check() for pretty files does not throw", () => {
        const distinctTests: string[] = getAllowedAndDistinctTestFileNames(files);
        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                const expected = readFileContents(`${fileNameRoot}-expected.md`);
                const cliOptions = SystemTestsConfig.getCliOptionsFor(fileNameRoot);

                assert.doesNotThrow(() => CliPrettify.check(expected, cliOptions));
            });
        }
    });
});

function getAllowedAndDistinctTestFileNames(files: string[]): string[] {
    return getDistinctTestFileNames(files, SystemTestsConfig.isAllowedForCliTests);
}
