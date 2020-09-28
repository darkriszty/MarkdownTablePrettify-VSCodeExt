import * as assert from 'assert';
import { Line } from '../../../../src/models/doc/line';

suite("Line tests", () => {

    test("value() without line breaks returns the give input", () => {
        assert.strictEqual(new Line("test").value, "test");
    });

    test("value() with \\r\\n at the end of line returns text without EOL", () => {
        assert.strictEqual(new Line("test\r\n").value, "test");
    });

    test("value() with \\n at the end of line returns text without EOL", () => {
        assert.strictEqual(new Line("test\n").value, "test");
    });

    test("value() with \\r at the end of line returns text without EOL", () => {
        assert.strictEqual(new Line("test\r").value, "test");
    });

    test("EOL() with \\r\\n at the end of line returns \\r\\n", () => {
        assert.strictEqual(new Line("test\r\n").EOL, "\r\n");
    });

    test("EOL() with \\r at the end of line returns \\r", () => {
        assert.strictEqual(new Line("test\r").EOL, "\r");
    });

    test("EOL() with \\n at the end of line returns \\n", () => {
        assert.strictEqual(new Line("test\n").EOL, "\n");
    });
});