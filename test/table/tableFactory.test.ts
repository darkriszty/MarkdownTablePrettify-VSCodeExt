import * as assert from "assert";
import * as vscode from "vscode";
import { TableFactory } from "../../src/table/tableFactory";
import { ITable } from "../../src/table/table";

suite("TableFactory tests", () => {

    test("create() no input null table returned", () => {
        const text = ``;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() one word null table returned", () => {
        const text = `not-a-table`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() multiple words null table returned", () => {
        const text = `still not a table`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() multiple words with separator null table returned", () => {
        const text = `still | not | a | table`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() multiple lines with separator but no row separator null table returned", () => {
        const text = `still | not | a | table
                      the | second | table | row`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() mismatching column counts null table returned", () => {
        const text = `still | not | a | table
                      second | table | row`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() one column header with separator and a row null table returned", () => {
        const text = `header
                      -|
                      row 1`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });

    test("create() two column header with separator and a row table instance created", () => {
        const text = `header 1 | header 2
                      -|-
                      value 1 | value 2`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(true, table != null);
        assert.equal(true, (table as ITable) != null);
    });

    test("create() two column header with longer separator and a row table instance created", () => {
        const text = `header 1 | header 2
                      ----|----
                      value 1 | value 2`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(true, table != null);
        assert.equal(true, (table as ITable) != null);
    });

    test("create() table with left border and valid separator a table instance created", () => {
        const text = `|header 1 | header 2
                      |-|----
                      |value 1 | value 2`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(true, table != null);
        assert.equal(true, (table as ITable) != null);
    });

    test("create() table with right border and valid separator a table instance created", () => {
        const text = `header 1 | header 2|
                      ---|----|
                      value 1 | value 2|`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(true, table != null);
        assert.equal(true, (table as ITable) != null);
    });

    test("create() table with both borders and valid separator a table instance created", () => {
        const text = `|header 1 | header 2|
                      |---|---|
                      |value 1 | value 2|`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(true, table != null);
        assert.equal(true, (table as ITable) != null);
    });

    test("create() two column header with invalid separator null table returned", () => {
        const text = `header 1 | header 2
                      |
                      value 1 | value 2`;
        const factory = new TableFactory();
        const table = factory.create(text);
        assert.equal(table, null);
    });
});