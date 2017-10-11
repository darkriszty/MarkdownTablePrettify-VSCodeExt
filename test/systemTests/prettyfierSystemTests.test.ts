import * as assert from 'assert';
import * as vscode from "vscode";
import { PrettyfierFromFile } from './tableRangePrettyfierFactory';

suite("Prettyfier system tests", () => {

    test("Ending table border added if the table starts with border", () => {
        new PrettyfierFromFile().assertPrettyfiedAsExpected(nameWithDir("addMissingTableEnding"));
    });

    test("CJK characters have lengths of 2", () => {
        new PrettyfierFromFile().assertPrettyfiedAsExpected(nameWithDir("cjk"));
    });

    test("Empty middle column added", () => {
        new PrettyfierFromFile().assertPrettyfiedAsExpected(nameWithDir("empty-middle-column"));
    });

    test("Redundant table ending removed if table doesn't start with border", () => {
        new PrettyfierFromFile().assertPrettyfiedAsExpected(nameWithDir("redundantTableEnding"));
    });

    function nameWithDir(fileName: string) {
        return `resources/${fileName}`;
    }
});