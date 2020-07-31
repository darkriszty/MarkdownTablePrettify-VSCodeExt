import * as assert from 'assert';
import { Document } from '../../../../src/models/doc/document';
import { Range } from '../../../../src/models/doc/range';

suite("Document tests", () => {

    test("getText() with a single line returns the input", () => {
        const text = "test";
        assert.equal(new Document(text).getText(), text);
    });

    test("getText() with two lines returns the input", () => {
        const text = "l1\r\nl2";
        assert.equal(new Document(text).getText(), text);
    });

    test("getText() with multiple lines and mixed endings returns the input", () => {
        const text = "l1\r\nl2\nl3\r\nl4\r\n\n";
        assert.equal(new Document(text).getText(), text);
    });

    test("getText() with range returns expected lines", () => {
        const text = `l1\r\nl2\nl3\r\nl4\nl5\nl6\nl7\nl8\nl9`;
        const expectedText = "l3\r\nl4\nl5\nl6";
        const range = new Range(2, 5);
        assert.equal(new Document(text).getText(range), expectedText);
    });

    test("replaceTextInRange() with multiple lines and mixed endings replaced generates the correct text", () => {
        const text = `l1\r\nl2\nl3\r\nl4\nl5\nl6\nl7\nl8\nl9`;
        const relacementText = "n3\r\nn4\r\nn5\r\nn6";
        const range = new Range(2, 5);
        const expectedText = `l1\r\nl2\nn3\r\nn4\r\nn5\r\nn6\nl7\nl8\nl9`;
        const document = new Document(text);

        document.replaceTextInRange(range, relacementText);

        assert.equal(document.getText(), expectedText);
    });

    test("replaceTextInRange() with full range replaced generates the correct text", () => {
        const text = `l1\r\nl2\nl3\r\nl4\nl5\nl6\nl7\nl8\nl9`;
        const relacementText = "n1\r\nn2\nn3\r\nn4\nn5\nn6\nn7\nn8\nn9";
        const range = new Range(0, 8);
        const expectedText = relacementText;
        const document = new Document(text);

        document.replaceTextInRange(range, relacementText);

        assert.equal(document.getText(), expectedText);
    });

});