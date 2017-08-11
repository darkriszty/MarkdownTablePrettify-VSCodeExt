import * as assert from 'assert';
import { assertExt } from "../assertExtensions";
import { TableViewModel } from "../../src/viewModels/tableViewModel";
import { TableStringWriter } from "../../src/writers/tableStringWriter";
import { RowViewModel } from "../../src/viewModels/rowViewModel";

suite("TableStringWriter tests", () => {

    test("writeTable() with valid input writes the header on the first row", () => {
        const input : TableViewModel = new TableViewModel();
        input.header = new RowViewModel(["c1", "c2"]);
        input.separator = new RowViewModel(["-", "-"]);
        input.rows = [ new RowViewModel(["v1", "v2"]) ];

        const tableText: string = createSut().writeTable(input);

        assertExt.isNotNull(tableText);
        const lines = tableText.split(/\r\n|\r|\n/);
        assert.equal(lines[0], "c1|c2");
    });

    test("writeTable() with valid input writes the separator on the second row", () => {
        const input : TableViewModel = new TableViewModel();
        input.header = new RowViewModel(["c1", "c2"]);
        input.separator = new RowViewModel(["---", "--"]);
        input.rows = [ new RowViewModel(["v1", "v2"]) ];

        const tableText: string = createSut().writeTable(input);

        assertExt.isNotNull(tableText);
        const lines = tableText.split(/\r\n|\r|\n/);
        assert.equal(lines[1], "---|--");
    });

    test("writeTable() with valid input writes the rows from the 3rd row on", () => {
        const input : TableViewModel = new TableViewModel();
        input.header = new RowViewModel(["c1", "c2"]);
        input.separator = new RowViewModel(["-", "-"]);
        input.rows = [ 
            new RowViewModel(["v1", "v2"]),
            new RowViewModel(["v3", "v4"]),
            new RowViewModel(["", "v5"])
        ];

        const tableText: string = createSut().writeTable(input);

        assertExt.isNotNull(tableText);
        const lines = tableText.split(/\r\n|\r|\n/);
        assert.equal(lines.length, 5);
        assert.equal(lines[2], "v1|v2");
        assert.equal(lines[3], "v3|v4");
        assert.equal(lines[4], "|v5");
    });

    test("writeTable() null table throws exception", () => {
        const writer = createSut();
        assert.throws(() => writer.writeTable(null));
    });

    test("writeTable() table without header throws exception", () => {
        const input : TableViewModel = new TableViewModel();
        input.separator = new RowViewModel([]);
        input.rows = [ new RowViewModel([]) ];

        const writer = createSut();

        assert.throws(() => writer.writeTable(input));
    });

    test("writeTable() table without separator throws exception", () => {
        const input : TableViewModel = new TableViewModel();
        input.header = new RowViewModel([]);
        input.rows = [ new RowViewModel([]) ];

        const writer = createSut();

        assert.throws(() => writer.writeTable(input));
    });

    test("writeTable() table with null rows throws exception", () => {
        const input : TableViewModel = new TableViewModel();
        input.header = new RowViewModel([]);
        input.separator = new RowViewModel([]);

        const writer = createSut();

        assert.throws(() => writer.writeTable(input));
    });

    test("writeTable() table with no rows throws exception", () => {
        const input : TableViewModel = new TableViewModel();
        input.header = new RowViewModel([]);
        input.rows = [ ];

        const writer = createSut();

        assert.throws(() => writer.writeTable(input));
    });

    function createSut() : TableStringWriter {
        return new TableStringWriter();
    }
});