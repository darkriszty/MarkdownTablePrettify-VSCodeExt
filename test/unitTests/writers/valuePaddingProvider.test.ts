import * as assert from "assert";
import { RowViewModel } from "../../../src/viewModels/rowViewModel";
import { TableViewModel } from "../../../src/viewModels/tableViewModel";
import { ValuePaddingProvider } from "../../../src/writers/valuePaddingProvider";

suite("ValuePaddingProvider tests", () => {

    test("getLeftPadding() returns the pad", () => {
        const sut = new ValuePaddingProvider(2);

        const pad = sut.getLeftPadding();

        assert.strictEqual(pad, "  ");
    });

    test("getRightPadding() returns the pad for middle columns", () => {
        const sut = new ValuePaddingProvider(3);
        const table = new TableViewModel();
        table.header = new RowViewModel(["", "", "", ""], "\n");

        const pad = sut.getRightPadding(table, 2);

        assert.strictEqual(pad, "   ");
    });

    test("getRightPadding() returns the pad for last column when the table has a right border", () => {
        const sut = new ValuePaddingProvider(3);
        const table = new TableViewModel();
        table.hasRightBorder = true;
        table.header = new RowViewModel(["", "", "", ""], "\n");

        const pad = sut.getRightPadding(table, 3);

        assert.strictEqual(pad, "   ");
    });

    test("getRightPadding() does not return the pad for last column when the table does not have a right border", () => {
        const sut = new ValuePaddingProvider(3);
        const table = new TableViewModel();
        table.hasRightBorder = false;
        table.header = new RowViewModel(["", "", "", ""], "\n");

        const pad = sut.getRightPadding(table, 3);

        assert.strictEqual(pad, "");
    });
});