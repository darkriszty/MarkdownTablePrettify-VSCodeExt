import * as assert from 'assert';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';

suite("SelectionInterpreter tests", () => {

    test("allRows() splits text by windows-style line endings", () => {
        const text = "line1\r\nline2";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.equal(rows.length, 2);
        assert.equal(rows[0].length, 1);
        assert.equal(rows[1].length, 1);
        assert.equal(rows[0][0], "line1");
        assert.equal(rows[1][0], "line2");
    });

    test("allRows() splits text by linux-style line endings", () => {
        const text = "foo\nbar";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.equal(rows.length, 2);
        assert.equal(rows[0].length, 1);
        assert.equal(rows[1].length, 1);
        assert.equal(rows[0][0], "foo");
        assert.equal(rows[1][0], "bar");
    });

    test("allRows() splits each line by | cell separator", () => {
        const text = "h1|h2\nv1|v2";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.equal(rows.length, 2);
        assert.equal(rows[0].length, 2);
        assert.equal(rows[1].length, 2);
        assert.equal(rows[0][0], "h1");
        assert.equal(rows[0][1], "h2");
        assert.equal(rows[1][0], "v1");
        assert.equal(rows[1][1], "v2");
    });

    test("allRows() doesn't consider \| as separator ", () => {
        const text = "h1|h2\|still h2\nv1|v2";
        const sut = createSut();

        const rows = sut.allRows(text);

        assert.equal(rows.length, 2);
        assert.equal(rows[0].length, 2);
        assert.equal(rows[1].length, 2);
        assert.equal(rows[0][0], "h1");
        assert.equal(rows[0][1], "h2\|still h2");
        assert.equal(rows[1][0], "v1");
        assert.equal(rows[1][1], "v2");
    });

    test("separator() returns the first row", () => {
        const text = "h1|h2\r\n:-|-\r\nv1|v2";
        const sut = createSut();

        const separator = sut.separator(text);

        assert.equal(separator.length, 2);
        assert.equal(separator[0], ":-");
        assert.equal(separator[1], "-");
    });

    function createSut(): SelectionInterpreter {
        return new SelectionInterpreter();
    }
});