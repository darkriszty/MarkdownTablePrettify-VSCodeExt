import * as assert from 'assert';
import { FairTableIndentationDetector } from "../../../src/modelFactory/tableIndentationDetector";

suite("FairTableIndentationDetector tests", () => {

    // hasIndentation() method tests
    test("hasIndentation() with no indented lines returns false", () => {
        const leftPadsPerLine: string[] = ["", "", ""];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, false);
    });

    test("hasIndentation() with all lines indented returns true", () => {
        const leftPadsPerLine: string[] = ["    ", "  ", "\t"];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, true);
    });

    test("hasIndentation() with majority indented lines returns true", () => {
        const leftPadsPerLine: string[] = ["    ", "", "  ", "\t"];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, true);
    });

    test("hasIndentation() with minority indented lines returns false", () => {
        const leftPadsPerLine: string[] = ["    ", "", "", ""];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, false);
    });

    test("hasIndentation() with exactly half indented lines returns true", () => {
        const leftPadsPerLine: string[] = ["    ", "  ", "", ""];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, true);
    });

    test("hasIndentation() with single line no indentation returns false", () => {
        const leftPadsPerLine: string[] = [""];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, false);
    });

    test("hasIndentation() with single line with indentation returns true", () => {
        const leftPadsPerLine: string[] = ["    "];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, true);
    });

    test("hasIndentation() with two lines one indented returns true", () => {
        const leftPadsPerLine: string[] = ["    ", ""];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, true);
    });

    test("hasIndentation() with empty array returns true", () => {
        const leftPadsPerLine: string[] = [];
        const sut = createDetector();

        const result = sut.testHasIndentation(leftPadsPerLine);

        assert.strictEqual(result, true);
    });

    // getLeftPad() method tests

    test("getLeftPad() with no indentation returns empty string", () => {
        const lines: string[] = [
            "| col1 | col2 |",
            "|------|------|",
            "| a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "");
    });

    test("getLeftPad() with consistent space indentation returns indentation", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "    |------|------|",
            "    | a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with consistent tab indentation returns tab indentation", () => {
        const lines: string[] = [
            "\t\t| col1 | col2 |",
            "\t\t|------|------|",
            "\t\t| a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "\t\t");
    });

    test("getLeftPad() with mixed tab and space indentation prefers tab prefix", () => {
        const lines: string[] = [
            "\t\t    | col1 | col2 |",
            "\t\t  |------|------|",
            "\t\t   | a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "\t\t");
    });

    test("getLeftPad() with partial tab indentation uses longest common tab prefix", () => {
        const lines: string[] = [
            "\t\t\t| col1 | col2 |",
            "\t\t|------|------|",
            "\t\t\t\t| a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "\t\t");
    });

    test("getLeftPad() with majority indented lines uses most common indentation", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "|------|------|",
            "    | a    | b    |",
            "    | c    | d    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with minority indented lines returns empty string", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "|------|------|",
            "| a    | b    |",
            "| c    | d    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "");
    });

    test("getLeftPad() with exactly half indented lines uses indentation", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "    |------|------|",
            "| a    | b    |",
            "| c    | d    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with different space indentations uses most frequent", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "  |------|------|",
            "    | a    | b    |",
            "    | c    | d    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with equal frequency indentations uses first occurrence", () => {
        const lines: string[] = [
            "  | col1 | col2 |",
            "    |------|------|",
            "  | a    | b    |",
            "    | c    | d    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "  ");
    });

    test("getLeftPad() with single unique indentation uses first line indentation", () => {
        const lines: string[] = [
            "  | col1 | col2 |",
            "    |------|------|",
            "      | a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "  ");
    });

    test("getLeftPad() with empty lines ignores them", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "",
            "    |------|------|",
            "    | a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with whitespace-only lines ignores them", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "   ",
            "    |------|------|",
            "    | a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with mixed tabs and spaces fallback to space logic when no common tab prefix", () => {
        const lines: string[] = [
            "    | col1 | col2 |",
            "\t|------|------|",
            "    | a    | b    |",
            "    | c    | d    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "    ");
    });

    test("getLeftPad() with single line returns empty string when no indentation", () => {
        const lines: string[] = [
            "| col1 | col2 |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "");
    });

    test("getLeftPad() with complex tab scenario maintains common prefix", () => {
        const lines: string[] = [
            "\t\t\t    | col1 | col2 |",
            "\t\t  |------|------|", 
            "\t\t\t\t\t| a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "\t\t");
    });

    test("getLeftPad() with no common tab prefix falls back to space logic", () => {
        const lines: string[] = [
            "\t    | col1 | col2 |",
            "  \t|------|------|", 
            "\t    | a    | b    |"
        ];
        const sut = createDetector();

        const result = sut.getLeftPad(lines);

        assert.strictEqual(result, "\t    ");
    });

    function createDetector(): TestableFairTableIndentationDetector {
        return new TestableFairTableIndentationDetector();
    }

    class TestableFairTableIndentationDetector extends FairTableIndentationDetector {
        public testHasIndentation(leftPadsPerLine: string[]): boolean {
            return this.hasIndentation(leftPadsPerLine);
        }

        public testGetIndentationChars(leftPadsPerLine: string[]): string {
            return this.getIndentationChars(leftPadsPerLine);
        }
    }
});
