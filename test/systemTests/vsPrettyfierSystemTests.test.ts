import * as fs from 'fs';
import * as path from 'path';
import { VsPrettyfierFromFile } from './vsPrettyfierFromFile';

fs.readdir(path.resolve(__dirname, "resources/"), function(err, files) {
    suite("VsCode Prettyfier system tests", () => {
        let distinctTests: string[] = files
            .filter(f => path.extname(f).toLowerCase() === ".md")
            .map(f => f.split("-")[0]).filter((item, i, s) => s.lastIndexOf(item) == i);

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