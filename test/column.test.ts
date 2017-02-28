import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
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

    test("getSize() matches the give raw column count plus 1 separator", () => {
        assertGetSize(new RawColumn([]), 0);
        assertGetSize(new RawColumn(["row 1"]), 2);
        assertGetSize(new RawColumn(["row 1","row 2"]), 3);
    });

    test("isEmpty() only for empty raw columns", () => {
        assertIsEmpty(new RawColumn([]), true);
        assertIsEmpty(new RawColumn(["row 1"]), false);
        assertIsEmpty(new RawColumn(["row 1","row 2"]), false);
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


