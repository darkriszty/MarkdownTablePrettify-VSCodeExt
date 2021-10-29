import * as fs from "fs";
import * as path from "path";

export function readFileContents(fileName: string) {
    return fs.readFileSync(pathFor(fileName), "utf-8");
}

export function getDistinctTestFileNames(files: string[], predicate?: (value: string) => boolean): string[] {
    return files
        .filter(f => path.extname(f).toLowerCase() === ".md")
        .filter(f => predicate !== undefined ? predicate(f) : true)
        .map(f => f.split("-")[0])
        .filter((item, i, s) => s.lastIndexOf(item) == i);
}

function pathFor(fileName: string): string {
    return path.resolve(__dirname, `resources/${fileName}`);
}