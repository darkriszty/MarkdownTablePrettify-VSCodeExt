import * as assert from "assert";
import { IMock, Mock, Times, It } from "typemoq";
import { TableDocumentPrettyfier } from "../../../src/extension/tableDocumentPrettyfier";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { MultiTablePrettyfier } from "../../../src/prettyfiers/multiTablePrettyfier";

suite("TableDocumentPrettyfier tests", () => {

    let _multiTablePrettyfier: IMock<MultiTablePrettyfier>;

    setup(() => {
        _multiTablePrettyfier = Mock.ofType<MultiTablePrettyfier>();
    });

    test("provideDocumentFormattingEdits() calls MultiTablePrettyfier", () => {
        const sut = createSut();
        const input = Array(10).fill("hello world").join("\n");
        const expectedResult = Array(10).fill("expected result").join("\n");
        const document = new MarkdownTextDocumentStub(input);
        // Note: due to a limitation of the MarkdownTextDocumentStub with OS line endings, we use `It.isAny()` instead of `input`.
        _multiTablePrettyfier.setup(multiTablePrettyfier => multiTablePrettyfier.formatTables(It.isAny())).returns(() => expectedResult)

        const result = sut.provideDocumentFormattingEdits(document, null, null);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].newText, expectedResult);
        assert.strictEqual(result[0].range.start.line, 0);
        assert.strictEqual(result[0].range.start.character, 0);
        assert.strictEqual(result[0].range.end.line, 9);
        assert.strictEqual(result[0].range.end.character, Number.MAX_SAFE_INTEGER);
        _multiTablePrettyfier.verify(multiTablePrettyfier => multiTablePrettyfier.formatTables(It.isAny()), Times.once());
    });

    function createSut(): TableDocumentPrettyfier {
        return new TableDocumentPrettyfier(_multiTablePrettyfier.object);
    }
});