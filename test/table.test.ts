import * as assert from 'assert';

import { Table } from '../src/table';

suite("Table Creation Tests", () => {

    test("create() no input null table returned", () => {
        const text = ``;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() one word null table returned", () => {
        const text = `not-a-table`;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() multiple words null table returned", () => {
        const text = `still not a table`;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() multiple words with separator null table returned", () => {
        const text = `still | not | a | table`;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() multiple lines with separator but no row separator null table returned", () => {
        const text = `still | not | a | table
                      the | second | table | row`;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() mismatching column counts null table returned", () => {
        const text = `still | not | a | table
                      second | table | row`;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() one column header with separator and a row null table returned", () => {
        const text = `header
                      -|
                      row 1`;
        const table = Table.create(text);
        assert.equal(table, null);
    });

    test("create() two column header with separator and a row table instance created", () => {
        const text = `header 1 | header 2
                      -|-
                      value 1 | value 2`;
        const table = Table.create(text);
        assert.equal(true, table != null);
    });
});

suite("Table pretty printing tests", () => {

});