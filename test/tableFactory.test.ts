import * as assert from 'assert';
import * as vscode from 'vscode';

import { TableFactory } from '../src/table';

suite("Table Factory Tests", () => {

    test("createTable() no input null table returned", () => {
        const text = ``;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() one word null table returned", () => {
        const text = `not-a-table`;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() multiple words null table returned", () => {
        const text = `still not a table`;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() multiple words with separator null table returned", () => {
        const text = `still | not | a | table`;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() multiple lines with separator but no row separator null table returned", () => {
        const text = `still | not | a | table
                      the | second | table | row`;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() mismatching column counts null table returned", () => {
        const text = `still | not | a | table
                      second | table | row`;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() one column header with separator and a row null table returned", () => {
        const text = `header
                      -|
                      row 1`;
        const table = TableFactory.createTable(text);
        assert.equal(table, null);
    });

    test("createTable() two column header with separator and a row table instance created", () => {
        const text = `header 1 | header 2
                      -|-
                      value 1 | value 2`;
        const table = TableFactory.createTable(text);
        assert.equal(true, table != null);
    });
});