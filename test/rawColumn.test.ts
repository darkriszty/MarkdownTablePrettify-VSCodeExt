import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { RawColumn } from '../src/column';

suite("RawColumn Tests", () => {

    test("ctor() sets cell values", () => {
        const values = ["one"];
        const rawColumn = new RawColumn(values);
        assert.equal(rawColumn.columnValues, values);
    });

    test("ctor() sets cell length for one value", () => {
        const values = ["one"];
        const rawColumn = new RawColumn(values);
        assert.equal(rawColumn.cellLength, 3);
    });

    test("ctor() sets cell length for multiple value to maxLength", () => {
        const values = ["one", "two", "123456789"];
        const rawColumn = new RawColumn(values);
        assert.equal(rawColumn.cellLength, 9);
    });

    test("isEmpty() is true for empty array values", () => {
        const values = [];
        const rawColumn = new RawColumn(values);
        assert.equal(rawColumn.isEmpty(), true);
    });

    test("isEmpty() is true for array with empty strings", () => {
        const values = ["", "", ""];
        const rawColumn = new RawColumn(values);
        assert.equal(rawColumn.isEmpty(), true);
    });
});

