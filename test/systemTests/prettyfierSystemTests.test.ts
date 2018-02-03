import * as fs from 'fs';
import * as path from 'path';
import { PrettyfierFromFile } from './tableRangePrettyfierFactory';

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("Prettyfier system tests", () => {
        let distinctTests: string[] = files.map(f => f.split("-")[0]).filter((item, i, s) => s.lastIndexOf(item) == i);

        for (let fileNameRoot of distinctTests) {
            test(`[${fileNameRoot}]`, () => {
                new PrettyfierFromFile().assertPrettyfiedAsExpected(nameWithDir(fileNameRoot));
            });
        }

        function nameWithDir(fileName: string) {
            return `resources/${fileName}`;
        }
    });
});