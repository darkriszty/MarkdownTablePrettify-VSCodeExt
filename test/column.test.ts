import * as assert from 'assert';
import * as vscode from 'vscode';

import { Column, ColumnPositioning, RawColumn } from '../src/column';

suite("Column Tests", () => {

    test("getPositioning() returns value passed to constructor", () => {
        const raw = new RawColumn([]);
        const unkownCol = new Column(raw, ColumnPositioning.Unkown);
        const firstCol = new Column(raw, ColumnPositioning.First);
        const middleCol = new Column(raw, ColumnPositioning.Middle);
        const lastCol = new Column(raw, ColumnPositioning.Last);
        assert.equal(unkownCol.getPositioning(), ColumnPositioning.Unkown);
        assert.equal(firstCol.getPositioning(), ColumnPositioning.First);
        assert.equal(middleCol.getPositioning(), ColumnPositioning.Middle);
        assert.equal(lastCol.getPositioning(), ColumnPositioning.Last);
    });

    test("getSize() matches the given raw column count plus 1 separator", () => {
        assertGetSize(new RawColumn([]), 0);
        assertGetSize(new RawColumn(["row 1"]), 2);
        assertGetSize(new RawColumn(["row 1","row 2"]), 3);
    });

    test("isEmpty() only for empty raw columns", () => {
        assertIsEmpty(new RawColumn([]), true);
        assertIsEmpty(new RawColumn(["row 1"]), false);
        assertIsEmpty(new RawColumn(["row 1","row 2"]), false);
    });

    test("getValue() first column gives expected values right padded to header length", () => {
        const column = new Column(new RawColumn(["Header row", "row 1","row 2"]), ColumnPositioning.First);
        assert.equal(column.getValue(0), "Header row ");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), "row 1      ");
        assert.equal(column.getValue(3), "row 2      ");
    });

    test("getValue() first column gives expected values right padded to longest row length", () => {
        const column = new Column(new RawColumn(["Header row", "very long first row","row 2"]), ColumnPositioning.First);
        assert.equal(column.getValue(0), "Header row          ");
        assert.equal(column.getValue(1), "--------------------");
        assert.equal(column.getValue(2), "very long first row ");
        assert.equal(column.getValue(3), "row 2               ");
    });

    test("getValue() middle column gives expected values padded to header length", () => {
        const column = new Column(new RawColumn(["Header row", "row 1","row 2"]), ColumnPositioning.Middle);
        assert.equal(column.getValue(0), " Header row ");
        assert.equal(column.getValue(1), "------------");
        assert.equal(column.getValue(2), " row 1      ");
        assert.equal(column.getValue(3), " row 2      ");
    });

    test("getValue() middle column gives expected values padded to longest row length", () => {
        const column = new Column(new RawColumn(["Header row", "very long first row","row 2"]), ColumnPositioning.Middle);
        assert.equal(column.getValue(0), " Header row          ");
        assert.equal(column.getValue(1), "---------------------");
        assert.equal(column.getValue(2), " very long first row ");
        assert.equal(column.getValue(3), " row 2               ");
    });

    test("getValue() last column gives expected values with only the separator having padded to header length", () => {
        const column = new Column(new RawColumn(["Header row", "row 1","row 2"]), ColumnPositioning.Last);
        assert.equal(column.getValue(0), " Header row");
        assert.equal(column.getValue(1), "------------");
        assert.equal(column.getValue(2), " row 1");
        assert.equal(column.getValue(3), " row 2");
    });

    test("getValue() last column gives expected values with only the separator having padded to longest row length", () => {
        const column = new Column(new RawColumn(["Header row", "very long first row","row 2"]), ColumnPositioning.Last);
        assert.equal(column.getValue(0), " Header row");
        assert.equal(column.getValue(1), "---------------------");
        assert.equal(column.getValue(2), " very long first row");
        assert.equal(column.getValue(3), " row 2");
    });

    test("getValue() with empty first column gives empty results", () => {
        const column = new Column(new RawColumn(["", "",""]), ColumnPositioning.First);
        assert.equal(column.getValue(0), "");
        assert.equal(column.getValue(1), "");
        assert.equal(column.getValue(2), "");
        assert.equal(column.getValue(3), "");
    });

    test("getValue() with empty middle column gives one space with padding on left and right", () => {
        const column = new Column(new RawColumn(["", "",""]), ColumnPositioning.Middle);
        assert.equal(column.getValue(0), "   ");
        assert.equal(column.getValue(1), "---");
        assert.equal(column.getValue(2), "   ");
        assert.equal(column.getValue(3), "   ");
    });

    test("getValue() with empty last column gives empty results", () => {
        const column = new Column(new RawColumn(["", "",""]), ColumnPositioning.Last);
        assert.equal(column.getValue(0), "");
        assert.equal(column.getValue(1), "");
        assert.equal(column.getValue(2), "");
        assert.equal(column.getValue(3), "");
    });

    function assertGetSize(raw: RawColumn, expectedSize: number){
        const firstCol = new Column(raw, ColumnPositioning.First);
        const middleCol = new Column(raw, ColumnPositioning.Middle);
        const lastCol = new Column(raw, ColumnPositioning.Last);
        assert.equal(firstCol.getSize(), expectedSize);
        assert.equal(middleCol.getSize(), expectedSize);
        assert.equal(lastCol.getSize(), expectedSize);
    }

    function assertIsEmpty(raw: RawColumn, expected: boolean){
        const firstCol = new Column(raw, ColumnPositioning.First);
        const middleCol = new Column(raw, ColumnPositioning.Middle);
        const lastCol = new Column(raw, ColumnPositioning.Last);
        assert.equal(firstCol.isEmpty(), expected);
        assert.equal(middleCol.isEmpty(), expected);
        assert.equal(lastCol.isEmpty(), expected);
    }
});


