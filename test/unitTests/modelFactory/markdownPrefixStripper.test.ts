import * as assert from "assert";
import { MarkdownPrefixStripper } from "../../../src/modelFactory/markdownPrefixStripper";

suite("MarkdownPrefixStripper tests", () => {

    suite("strip()", () => {

        test("strips blockquote prefix from all lines", () => {
            const input = "> | col1 | col2 |\n> |------|------|\n> | a    | b    |";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, "| col1 | col2 |\n|------|------|\n| a    | b    |");
            assert.deepStrictEqual(result.prefixes, ["> ", "> ", "> "]);
        });

        test("strips nested blockquote prefix from all lines", () => {
            const input = ">> | col1 | col2 |\n>> |------|\n>> | a    |";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, "| col1 | col2 |\n|------|\n| a    |");
            assert.deepStrictEqual(result.prefixes, [">> ", ">> ", ">> "]);
        });

        test("strips blockquote prefix with spaces before >", () => {
            const input = "  > | col1 |\n  > |------|\n  > | a    |";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, "| col1 |\n|------|\n| a    |");
            assert.deepStrictEqual(result.prefixes, ["  > ", "  > ", "  > "]);
        });

        test("strips numbered list marker when followed by whitespace and pipe", () => {
            const input = "1.\t|col1|col2|\n\t|-|-|\n\t|a|b|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, "\t|col1|col2|\n\t|-|-|\n\t|a|b|");
            assert.deepStrictEqual(result.prefixes, ["1.", "", ""]);
        });

        test("strips numbered list marker with closing parenthesis", () => {
            const input = "1) |col1|\n   |-|\n   |a|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, " |col1|\n   |-|\n   |a|");
            assert.deepStrictEqual(result.prefixes, ["1)", "", ""]);
        });

        test("strips bullet list marker (-) when followed by whitespace and pipe", () => {
            const input = "- |col1|col2|\n  |-|-|\n  |x|y|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, " |col1|col2|\n  |-|-|\n  |x|y|");
            assert.deepStrictEqual(result.prefixes, ["-", "", ""]);
        });

        test("strips bullet list marker (*) when followed by whitespace and pipe", () => {
            const input = "* |col1|col2|\n  |-|-|\n  |x|y|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, " |col1|col2|\n  |-|-|\n  |x|y|");
            assert.deepStrictEqual(result.prefixes, ["*", "", ""]);
        });

        test("strips bullet list marker (+) when followed by whitespace and pipe", () => {
            const input = "+ |col1|col2|\n  |-|-|\n  |x|y|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, " |col1|col2|\n  |-|-|\n  |x|y|");
            assert.deepStrictEqual(result.prefixes, ["+", "", ""]);
        });

        test("does not strip list marker when no pipe follows", () => {
            const input = "1. Just a list item\n- Another item\n* Third item";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, input);
            assert.deepStrictEqual(result.prefixes, ["", "", ""]);
        });

        test("strips combined blockquote and list marker", () => {
            const input = "> 1. |col1|\n> |-|\n> |a|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, " |col1|\n|-|\n|a|");
            assert.deepStrictEqual(result.prefixes, ["> 1.", "> ", "> "]);
        });

        test("does not strip content that merely starts with whitespace", () => {
            const input = "\t|col1|col2|\n\t|-|-|\n\t|a|b|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, input);
            assert.deepStrictEqual(result.prefixes, ["", "", ""]);
        });

        test("handles mixed prefixed and non-prefixed lines", () => {
            const input = "Some text\n> |col1|\n> |-|\n> |a|\nMore text";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, "Some text\n|col1|\n|-|\n|a|\nMore text");
            assert.deepStrictEqual(result.prefixes, ["", "> ", "> ", "> ", ""]);
        });

        test("is no-op for plain table without prefix", () => {
            const input = "|col1|col2|\n|-|-|\n|a|b|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, input);
            assert.deepStrictEqual(result.prefixes, ["", "", ""]);
        });

        test("preserves line endings", () => {
            const input = "> |col1|\r\n> |-|\r\n> |a|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, "|col1|\r\n|-|\r\n|a|");
        });

        test("strips multi-digit numbered list marker", () => {
            const input = "10. |col1|\n    |-|\n    |a|";
            const result = createSut().strip(input);

            assert.strictEqual(result.strippedText, " |col1|\n    |-|\n    |a|");
            assert.deepStrictEqual(result.prefixes, ["10.", "", ""]);
        });
    });

    suite("restore()", () => {

        test("prepends stored prefixes to each line", () => {
            const text = "| col1 |\n|------|\n| a    |";
            const prefixes = ["> ", "> ", "> "];
            const result = createSut().restore(text, prefixes);

            assert.strictEqual(result, "> | col1 |\n> |------|\n> | a    |");
        });

        test("handles mixed prefixes", () => {
            const text = "\t| col1 |\n\t|------|\n\t| a    |";
            const prefixes = ["1.", "", ""];
            const result = createSut().restore(text, prefixes);

            assert.strictEqual(result, "1.\t| col1 |\n\t|------|\n\t| a    |");
        });

        test("handles empty prefixes as no-op", () => {
            const text = "|col1|\n|-|\n|a|";
            const prefixes = ["", "", ""];
            const result = createSut().restore(text, prefixes);

            assert.strictEqual(result, text);
        });

        test("preserves line endings", () => {
            const text = "|col1|\r\n|-|\r\n|a|";
            const prefixes = ["> ", "> ", "> "];
            const result = createSut().restore(text, prefixes);

            assert.strictEqual(result, "> |col1|\r\n> |-|\r\n> |a|");
        });
    });

    suite("roundtrip", () => {

        test("strip() + restore() preserves original text with blockquote prefix", () => {
            const original = "> | col1 | col2 |\n> |------|------|\n> | a    | b    |";
            const sut = createSut();
            const { strippedText, prefixes } = sut.strip(original);
            const restored = sut.restore(strippedText, prefixes);

            assert.strictEqual(restored, original);
        });

        test("strip() + restore() preserves original text with list marker prefix", () => {
            const original = "1.\t|col1|col2|\n\t|-|-|\n\t|a|b|";
            const sut = createSut();
            const { strippedText, prefixes } = sut.strip(original);
            const restored = sut.restore(strippedText, prefixes);

            assert.strictEqual(restored, original);
        });

        test("strip() + restore() preserves text without any prefix", () => {
            const original = "|col1|col2|\n|-|-|\n|a|b|";
            const sut = createSut();
            const { strippedText, prefixes } = sut.strip(original);
            const restored = sut.restore(strippedText, prefixes);

            assert.strictEqual(restored, original);
        });

        test("strip() + restore() preserves text with CRLF endings", () => {
            const original = "> |col1|\r\n> |-|\r\n> |a|";
            const sut = createSut();
            const { strippedText, prefixes } = sut.strip(original);
            const restored = sut.restore(strippedText, prefixes);

            assert.strictEqual(restored, original);
        });
    });

    function createSut(): MarkdownPrefixStripper {
        return new MarkdownPrefixStripper();
    }
});
