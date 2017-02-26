import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Column, ColumnType } from '../src/column';

suite("Column Tests", () => {

    test("ctor() creates zero sized column", () => {
        const column = new Column(10, ColumnType.First);
        assert.equal(column.getSize(), 0);
    });

    test("getType() returns value passed to ctor", () => {
        const column = new Column(10, ColumnType.Middle);
        assert.equal(column.getType(), ColumnType.Middle);
    });

    test("getValue() returns value added by addValue() with padding", () => {
        const column = new Column(10, ColumnType.First);
        column.addValue("hello");
        assert.equal(column.getValue(0), "hello      ");
    });

    test("addValue() creates the separator as second element with padding", () => {
        const column = new Column(10, ColumnType.First);
        column.addValue("hello");
        column.addValue("world");
        assert.equal(column.getValue(0), "hello      ");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), "world      ");
    });

    test("addValue() doesn't add left space padding for first column", () => {
        const column = new Column(10, ColumnType.First);
        column.addValue("hello");
        column.addValue("world");
        assert.equal(column.getValue(0), "hello      ");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), "world      ");
    });

    test("addValue() adds left space padding for middle columns", () => {
        const column = new Column(10, ColumnType.Middle);
        column.addValue("hello");
        column.addValue("world");
        assert.equal(column.getValue(0), " hello     ");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), " world     ");
    });

    test("addValue() adds left space padding for last column", () => {
        const column = new Column(10, ColumnType.Last);
        column.addValue("hello");
        column.addValue("world");
        assert.equal(column.getValue(0), " hello     ");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), " world     ");
    });

    test("addValue() doesn't add right padding last column cells", () => {
        const column = new Column(10, ColumnType.Last);
        column.addValue("hello");
        column.addValue("");
        column.addValue("world");
        assert.equal(column.getValue(0), " hello");
        assert.equal(column.getValue(1), "-----------");
        assert.equal(column.getValue(2), "");
        assert.equal(column.getValue(2), " world");
    });
});

