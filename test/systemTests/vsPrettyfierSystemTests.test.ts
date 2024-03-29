import * as fs from 'fs';
import * as path from 'path';
import { getDistinctTestFileNames } from './systemTestFileReader';
import { VsPrettyfierFromFile } from './vsPrettyfierFromFile';

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("VsCode Prettyfier system tests", () => {
        let distinctTests: string[] = getDistinctTestFileNames(files);

        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                new VsPrettyfierFromFile().assertPrettyfiedAsExpected(nameWithDir(fileNameRoot));
            });
        }

        function nameWithDir(fileName: string) {
            return `resources/${fileName}`;
        }
    });
});
