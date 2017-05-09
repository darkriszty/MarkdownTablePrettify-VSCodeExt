import * as assert from 'assert';
import { Table } from "../../src/models/table";
import { TableFactory } from "../../src/models/tableFactory";

suite("Table pretty printing tests", () => {

    test("prettyPrint() two column and one row creates three lines", () => {
        const text: string = `
            header 1 | header 2
            -|-
            value 1 | value 2"`;
        const tableContentRows = getTableRows(text);
        assert.equal(3, tableContentRows.length);
    });

    test("prettyPrint() header longer than content and gets padded with a single space", () => {
        const text: string = `
           header 1 | header 2 | header 3
            -|-|-
            v 1 | v 2" | v 3`;
        const tableContentRows = getTableRows(text);
        assert.equal("header 1 | header 2 | header 3", tableContentRows[0]);
    });

    test("prettyPrint() header longer than content with extra whitespace and gets padded with a single space", () => {
        const text: string = `
           header 1       |            header 2 |        header 3     
            -|-|-
            v 1 | v 2" | v 3`;
        const tableContentRows = getTableRows(text);
        assert.equal("header 1 | header 2 | header 3", tableContentRows[0]);
    });

    test("prettyPrint() header longer than content and separator padded to header length", () => {
        const text: string = `
           header 1 | header 2 | header 3
           -|-|-
           v 1 | v 2" | v 3`;
        const tableContentRows = getTableRows(text);
        assert.equal("---------|----------|----------", tableContentRows[1]);
    });

    test("prettyPrint() header shorter than content and all but last header gets padded to the content length", () => {
        const text: string = `
           h 1 | h 2 | h 3
           -|-|-
           value 1 | value 2 | value 3`;
        const tableContentRows = getTableRows(text);
        assert.equal("h 1     | h 2     | h 3", tableContentRows[0]);
    });

    test("prettyPrint() header shorter than content and separator gets padded to the content length", () => {
        const text: string = `
           h 1 | h 2 | h 3
           -|-|-
           value 1 | value 2 | value 3`;
        const tableContentRows = getTableRows(text);
        assert.equal("--------|---------|---------", tableContentRows[1]);
    });

    test("prettyPrint() header longer than content with extra whitespace values get padded to header length", () => {
        const text: string = `
           header 1       |           header 2 |         header 3     
           -|-|-
           v 1                   |         v 2| v 3`;
        const tableContentRows = getTableRows(text);
        assert.equal("v 1      | v 2      | v 3", tableContentRows[2]);
    });

    test("prettyPrint() uses length 2 for CJK characters", () => {
        const text: string = `
           h 1 | h 2 | h 3
           -|-|-
           value ÿ | value 佚 | value á`;
        const tableContentRows = getTableRows(text);
        assert.equal(tableContentRows.length, 3);
        assert.equal("h 1     | h 2      | h 3", tableContentRows[0]);
        assert.equal("--------|----------|---------", tableContentRows[1]);
        assert.equal("value ÿ | value 佚 | value á", tableContentRows[2]);
    });

    function getTableRows(text) {
        return new TableFactory().create(text).prettyPrint().split(/\r\n|\r|\n/);
    }
});

