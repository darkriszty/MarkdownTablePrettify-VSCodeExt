import * as assert from 'assert';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';

suite("SelectionInterpreter tests", () => {

    test("allRows() splits text by windows-style line endings", () => {
        const text = "line1\r\nline2";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].length, 1);
        assert.strictEqual(rows[1].length, 1);
        assert.strictEqual(rows[0][0], "line1");
        assert.strictEqual(rows[1][0], "line2");
    });

    test("allRows() splits text by linux-style line endings", () => {
        const text = "foo\nbar";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].length, 1);
        assert.strictEqual(rows[1].length, 1);
        assert.strictEqual(rows[0][0], "foo");
        assert.strictEqual(rows[1][0], "bar");
    });

    test("allRows() splits each line by | cell separator", () => {
        const text = "h1|h2\nv1|v2";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].length, 2);
        assert.strictEqual(rows[1].length, 2);
        assert.strictEqual(rows[0][0], "h1");
        assert.strictEqual(rows[0][1], "h2");
        assert.strictEqual(rows[1][0], "v1");
        assert.strictEqual(rows[1][1], "v2");
    });

    test("allRows() line starting and ending with pipe is correctly splitted", () => {
        const text = "|h1|h2|h3|h4|";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 1);
        assert.strictEqual(rows[0].length, 6);
        assert.strictEqual(rows[0][0], "");
        assert.strictEqual(rows[0][1], "h1");
        assert.strictEqual(rows[0][2], "h2");
        assert.strictEqual(rows[0][3], "h3");
        assert.strictEqual(rows[0][4], "h4");
        assert.strictEqual(rows[0][5], "");
    });

    test("allRows() doesn't consider \\| as separator", () => {
        const text = "h1|h2\\|still\\|h2\nv1|v2";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].length, 2);
        assert.strictEqual(rows[1].length, 2);
        assert.strictEqual(rows[0][0], "h1");
        assert.strictEqual(rows[0][1], "h2\\|still\\|h2");
        assert.strictEqual(rows[1][0], "v1");
        assert.strictEqual(rows[1][1], "v2");
    });

    test("allRows() doesn't consider separator that's in a `code block` #1", () => {
        const text = "`h1|h2|h3`";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 1);
        assert.strictEqual(rows[0].length, 1);
        assert.strictEqual(rows[0][0], "`h1|h2|h3`");
    });

    test("allRows() doesn't consider separator that's in a `code block` #2", () => {
        const text = "h1|h2`|still|h2`|h3";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 1);
        assert.strictEqual(rows[0].length, 3);
        assert.strictEqual(rows[0][0], "h1");
        assert.strictEqual(rows[0][1], "h2`|still|h2`");
        assert.strictEqual(rows[0][2], "h3");
    });

    test("allRows() doesn't consider separator that's in a `code block` #3", () => {
        const text = "`h1|h1`|h2|h3`|h3`";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 1);
        assert.strictEqual(rows[0].length, 3);
        assert.strictEqual(rows[0][0], "`h1|h1`");
        assert.strictEqual(rows[0][1], "h2");
        assert.strictEqual(rows[0][2], "h3`|h3`");
    });

    test("separator() returns the first row", () => {
        const text = "h1|h2\r\n:-|-\r\nv1|v2";
        const sut = createSut();

        const separator = sut.separator(text);

        assert.strictEqual(separator.length, 2);
        assert.strictEqual(separator[0], ":-");
        assert.strictEqual(separator[1], "-");
    });

    test("allRows() in strict mode returns empty lines", () => {
        const text = "line1\r\nline2\r\n";
        const sut = createSut(true);

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 3);
        assert.strictEqual(rows[0].length, 1);
        assert.strictEqual(rows[1].length, 1);
        assert.strictEqual(rows[2].length, 0);
        assert.strictEqual(rows[0][0], "line1");
        assert.strictEqual(rows[1][0], "line2");
    });

    test("allRows() in non-strict mode skips empty lines", () => {
        const text = "line1\r\nline2\r\n";
        const sut = createSut(false);

        const rows = sut.allRows(text);

        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].length, 1);
        assert.strictEqual(rows[1].length, 1);
        assert.strictEqual(rows[0][0], "line1");
        assert.strictEqual(rows[1][0], "line2");
    });

    function createSut(strict: boolean = false): SelectionInterpreter {
        return new SelectionInterpreter(strict);
    }
});