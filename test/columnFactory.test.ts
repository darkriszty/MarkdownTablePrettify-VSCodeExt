import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { ColumnFactory, Column, ColumnPositioning } from '../src/column';

suite("ColumnFactory Tests", () => {

    test("generateColumns() one row and separator creates 3 columns", () => {
        const rows = [
            ["one", "two", "three"],
            ["-|", "-|", "-"]
        ];
        const columns = Array.from(ColumnFactory.generateColumns(rows));
        
        assert.equal(columns.length, 3);
    });
});

