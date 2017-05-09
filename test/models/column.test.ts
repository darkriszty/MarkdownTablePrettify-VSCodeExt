import * as assert from 'assert';
import { Column } from "../../src/models/column";
import { ColumnPositioning } from "../../src/models/columnPositioning";
import { Cell } from "../../src/models/cell";

suite("Column Tests", () => {

    test("getPositioning() returns value passed to setPositioning", () => {
        const cells: Cell[] = [];
        const unkownCol = new Column(cells);
        const firstCol = new Column(cells);
        const middleCol = new Column(cells);
        const lastCol = new Column(cells);

        unkownCol.setPositioning(ColumnPositioning.Unkown);
        firstCol.setPositioning(ColumnPositioning.First);
        middleCol.setPositioning(ColumnPositioning.Middle);
        lastCol.setPositioning(ColumnPositioning.Last);

        assert.equal(unkownCol.getPositioning(), ColumnPositioning.Unkown);
        assert.equal(firstCol.getPositioning(), ColumnPositioning.First);
        assert.equal(middleCol.getPositioning(), ColumnPositioning.Middle);
        assert.equal(lastCol.getPositioning(), ColumnPositioning.Last);
    });

    test("getNumberOfRows() matches the given raw column count plus 1 separator", () => {
        assertGetSize([], 1);
        assertGetSize([ new Cell("row 1") ], 2);
        assertGetSize([ new Cell("row 1"), new Cell("row 2") ], 3);
    });

    test("isEmpty() only for empty raw columns", () => {
        assertIsEmpty([], true);
        assertIsEmpty([ new Cell("row 1") ], false);
        assertIsEmpty([ new Cell("row 1"), new Cell("row 2") ], false);
    });

    test("getValue() first column gives expected values right padded to header length", () => {
        const column = new Column([new Cell("Header row"), new Cell("row 1"), new Cell("row 2")]);
        column.setPositioning(ColumnPositioning.First);
        assert.equal(column.getValue(0), "Header row ");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), "row 1      ");
        assert.equal(column.getValue(3), "row 2      ");
    });

    test("getValue() first column gives expected values right padded to longest row length", () => {
        const column = new Column([new Cell("Header row"), new Cell("very long first row"), new Cell("row 2")]);
        column.setPositioning(ColumnPositioning.First);
        assert.equal(column.getValue(0), "Header row          ");
        assert.equal(column.getValue(1), "--------------------");
        assert.equal(column.getValue(2), "very long first row ");
        assert.equal(column.getValue(3), "row 2               ");
    });

    test("getValue() middle column gives expected values padded to header length", () => {
        const column = new Column([new Cell("Header row"), new Cell("row 1"), new Cell("row 2")]);
        column.setPositioning(ColumnPositioning.Middle);
        assert.equal(column.getValue(0), " Header row ");
        assert.equal(column.getValue(1), "------------");
        assert.equal(column.getValue(2), " row 1      ");
        assert.equal(column.getValue(3), " row 2      ");
    });

    test("getValue() middle column gives expected values padded to longest row length", () => {
        const column = new Column([new Cell("Header row"), new Cell("very long first row"), new Cell("row 2")]);
        column.setPositioning(ColumnPositioning.Middle);
        assert.equal(column.getValue(0), " Header row          ");
        assert.equal(column.getValue(1), "---------------------");
        assert.equal(column.getValue(2), " very long first row ");
        assert.equal(column.getValue(3), " row 2               ");
    });

    test("getValue() last column gives expected values with only the separator having padded to header length", () => {
        const column = new Column([new Cell("Header row"), new Cell("row 1"), new Cell("row 2")]);
        column.setPositioning(ColumnPositioning.Last);
        assert.equal(column.getValue(0), " Header row");
        assert.equal(column.getValue(1), "------------");
        assert.equal(column.getValue(2), " row 1");
        assert.equal(column.getValue(3), " row 2");
    });

    test("getValue() last column gives expected values with only the separator having padded to longest row length", () => {
        const column = new Column([new Cell("Header row"), new Cell("very long first row"), new Cell("row 2")]);
        column.setPositioning(ColumnPositioning.Last);
        assert.equal(column.getValue(0), " Header row");
        assert.equal(column.getValue(1), "---------------------");
        assert.equal(column.getValue(2), " very long first row");
        assert.equal(column.getValue(3), " row 2");
    });

    test("getValue() with empty first column gives empty results", () => {
        const column = new Column([new Cell(""), new Cell(""), new Cell("")]);
        column.setPositioning(ColumnPositioning.First);
        assert.equal(column.getValue(0), "");
        assert.equal(column.getValue(1), "");
        assert.equal(column.getValue(2), "");
        assert.equal(column.getValue(3), "");
    });

    test("getValue() with empty middle column gives one space with padding on left and right", () => {
        const column = new Column([new Cell(""), new Cell(""), new Cell("")]);
        column.setPositioning(ColumnPositioning.Middle);
        assert.equal(column.getValue(0), "   ");
        assert.equal(column.getValue(1), "---");
        assert.equal(column.getValue(2), "   ");
        assert.equal(column.getValue(3), "   ");
    });

    test("getValue() with empty last column gives empty results", () => {
        const column = new Column([new Cell(""), new Cell(""), new Cell("")]);
        column.setPositioning(ColumnPositioning.Last);
        assert.equal(column.getValue(0), "");
        assert.equal(column.getValue(1), "");
        assert.equal(column.getValue(2), "");
        assert.equal(column.getValue(3), "");
    });

    function assertGetSize(cells: Cell[], expectedSize: number){
        const column = new Column(cells);
        assert.equal(column.getNumberOfRows(), expectedSize);
    }

    function assertIsEmpty(cells: Cell[], expected: boolean){
        const firstCol = new Column(cells);
        const middleCol = new Column(cells);
        const lastCol = new Column(cells);
        firstCol.setPositioning(ColumnPositioning.First);
        middleCol.setPositioning(ColumnPositioning.Middle);
        lastCol.setPositioning(ColumnPositioning.Last);

        assert.equal(firstCol.isEmpty(), expected);
        assert.equal(middleCol.isEmpty(), expected);
        assert.equal(lastCol.isEmpty(), expected);
    }
});