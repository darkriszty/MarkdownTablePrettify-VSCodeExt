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

    test("prettyPrint() two column and one row creates three lines", () => {
        const text = 
`header 1 | header 2
-|-
value 1 | value 2`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal(3, tableContentRows.length);
    });

    test("prettyPrint() header longer than content and gets padded with a single space", () => {
        const text = 
`header 1|header 2|header 3
-|-|-
v 1 | v 2|v3`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal("header 1 | header 2 | header 3", tableContentRows[0]);
    });

    test("prettyPrint() header longer than content with extra whitespace and gets padded with a single space", () => {
        const text = 
`header 1       |           header 2|        header 3     
-|-|-
v 1 | v 2|v3`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal("header 1 | header 2 | header 3", tableContentRows[0]);
    });

    test("prettyPrint() header longer than content and separator padded to header length", () => {
        const text = 
`header 1|header 2|header 3
-|-|-
v 1 | v 2|v3`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal("---------|----------|----------", tableContentRows[1]);
    });

    test("prettyPrint() header shorter than content and all but last header gets padded to the content length", () => {
        const text = 
`h 1|h 2|h 3
-|-|-
value 1| value 2 |value 3`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal("h 1     | h 2     | h 3", tableContentRows[0]);
    });

    test("prettyPrint() header shorter than content and separator gets padded to the content length", () => {
        const text = 
`h 1|h 2|h 3
-|-|-
value 1|value 2|value 3`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal("--------|---------|---------", tableContentRows[1]);
    });

    test("prettyPrint() header longer than content with extra whitespace values get padded to header length", () => {
        const text = 
`header 1       |           header 2|        header 3     
-|-|-
v 1                   |         v 2|v 3`;
        const tableContentRows = Table.create(text).prettyPrint().split(/\r\n|\r|\n/);
        assert.equal("v 1      | v 2      | v 3", tableContentRows[2]);
    });
});