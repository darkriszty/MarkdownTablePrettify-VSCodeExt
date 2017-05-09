import * as assert from 'assert';
import { ColumnFactory } from "../../src/models/columnFactory";
import { Column } from "../../src/models/column";
import { ColumnPositioning } from "../../src/models/columnPositioning";

suite("ColumnFactory Tests", () => {

    test("generateColumns() array with 1 element creates 1 columns", () => {
        const rows = [
            ["one"]
        ];
        const columns = Array.from(ColumnFactory.generateColumns(rows));

        assert.equal(columns.length, 1);
    });

    test("generateColumns() array with 3 elements creates 3 columns", () => {
        const rows = [
            ["one", "two", "three"]
        ];
        const columns = Array.from(ColumnFactory.generateColumns(rows));

        assert.equal(columns.length, 3);
    });

    test("generateColumns() 2D array with 4 elements creates 4 columns", () => {
        const rows = [
            ["one", "two", "three", "four"],
            ["1", "2", "3", "4"]
        ];
        const columns = Array.from(ColumnFactory.generateColumns(rows));

        assert.equal(columns.length, 4);
    });

    test("generateColumns() trims headers and values from extra whitespace", () => {
        const rows = [
            ["  one   ", "two", "   three", "four"],
            ["1", "         2", "3   ", "4          "]
        ];
        const columns = Array.from(ColumnFactory.generateColumns(rows));

        assert.equal(columns[0].getValue(0), "one ");
        assert.equal(columns[0].getValue(1), "----");
        assert.equal(columns[0].getValue(2), "1   ");

        assert.equal(columns[1].getValue(0), " two ");
        assert.equal(columns[1].getValue(1), "-----");
        assert.equal(columns[1].getValue(2), " 2   ");

        assert.equal(columns[2].getValue(0), " three ");
        assert.equal(columns[2].getValue(1), "-------");
        assert.equal(columns[2].getValue(2), " 3     ");

        assert.equal(columns[3].getValue(0), " four");
        assert.equal(columns[3].getValue(1), "------");
        assert.equal(columns[3].getValue(2), " 4");
    });

    test("generateColumns() set correct ColumnPositioning", () => {
        const rows = [
            ["one", "two", "three", "four"],
            ["1", "2", "3", "4"]
        ];
        const columns: Column[] = Array.from(ColumnFactory.generateColumns(rows));
        assert.equal(columns.length, 4);
        assert.equal(columns[0].getPositioning(), ColumnPositioning.First);
        assert.equal(columns[1].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[2].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[3].getPositioning(), ColumnPositioning.Last);
    });

    test("generateColumns() adds empty last column if first column is empty", () => {
        const rows = [
            ["", "two", "three", "four"],
            ["", "2", "3", "4"]
        ];
        const columns: Column[] = Array.from(ColumnFactory.generateColumns(rows));
        assert.equal(columns.length, 5);

        assert.equal(columns[0].getPositioning(), ColumnPositioning.First);
        assert.equal(columns[0].isEmpty(), true);
        assert.equal(columns[1].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[2].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[3].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[4].getPositioning(), ColumnPositioning.Last);
        assert.equal(columns[4].isEmpty(), true);
    });

    test("generateColumns() removes last empty column if first is not empty", () => {
        const rows = [
            ["one", "two", "three", "four", ""],
            ["1", "2", "3", "4", ""]
        ];
        const columns: Column[] = Array.from(ColumnFactory.generateColumns(rows));
        assert.equal(columns.length, 4);

        assert.equal(columns[0].getPositioning(), ColumnPositioning.First);
        assert.equal(columns[0].isEmpty(), false);
        assert.equal(columns[1].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[2].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[3].getPositioning(), ColumnPositioning.Last);
        assert.equal(columns[3].isEmpty(), false);
    });

    test("generateColumns() does not touch first or last columns if they're both empty", () => {
        const rows = [
            ["", "one", "two", "three", "four", ""],
            ["", "1", "2", "3", "4", ""]
        ];
        const columns: Column[] = Array.from(ColumnFactory.generateColumns(rows));
        assert.equal(columns.length, 6);

        assert.equal(columns[0].getPositioning(), ColumnPositioning.First);
        assert.equal(columns[0].isEmpty(), true);
        assert.equal(columns[1].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[2].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[3].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[4].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[5].getPositioning(), ColumnPositioning.Last);
        assert.equal(columns[5].isEmpty(), true);
    });

    test("generateColumns() keeps any middle empty columns", () => {
        const rows = [
            ["one", "", "two", "three", "", "four"],
            ["1", "", "2", "3", "", "4"]
        ];
        const columns: Column[] = Array.from(ColumnFactory.generateColumns(rows));
        assert.equal(columns.length, 6);

        assert.equal(columns[0].getPositioning(), ColumnPositioning.First);
        assert.equal(columns[1].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[1].isEmpty(), true);
        assert.equal(columns[2].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[3].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[4].getPositioning(), ColumnPositioning.Middle);
        assert.equal(columns[4].isEmpty(), true);
        assert.equal(columns[5].getPositioning(), ColumnPositioning.Last);
    });
});

