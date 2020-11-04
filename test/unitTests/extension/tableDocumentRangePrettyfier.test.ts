import * as assert from "assert";
import { IMock, Mock, It, Times } from "typemoq";
import { TableDocumentRangePrettyfier } from "../../../src/extension/tableDocumentRangePrettyfier";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { SingleTablePrettyfier } from "../../../src/prettyfiers/singleTablePrettyfier";

suite("TableDocumentRangePrettyfier tests", () => {

    let _singleTablePrettyfier: IMock<SingleTablePrettyfier>;

    setup(() => {
        _singleTablePrettyfier = Mock.ofType<SingleTablePrettyfier>();
    });

    test("provideDocumentRangeFormattingEdits() calls table validator", () => {
        const sut = createSut();
        const input = Array(5).fill("hello world").join("\n");
        const expectedResult = Array(5).fill("expected result").join("\n");
        const document = new MarkdownTextDocumentStub(input);
        const range = document.getFullRange();
        _singleTablePrettyfier.setup(_ => _.prettifyTable(It.isAny(), It.isAny())).returns(() => expectedResult);

        const result = sut.provideDocumentRangeFormattingEdits(document, range, null, null);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].range, range);
        _singleTablePrettyfier.verify(_ => _.prettifyTable(It.isAny(), It.isAny()), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() invalid table selection doesn't alter the selected text", () => {
        const sut = createSut();
        const input = Array(5).fill("hello world").join("\n");
        const expectedResult = null;
        const document = new MarkdownTextDocumentStub(input);
        const range = document.getFullRange();
        _singleTablePrettyfier.setup(_ => _.prettifyTable(It.isAny(), It.isAny())).returns(() => expectedResult);

        const result = sut.provideDocumentRangeFormattingEdits(document, range, null, null);

        assert.strictEqual(result.length, 0);
    });

    function createSut(): TableDocumentRangePrettyfier {
        return new TableDocumentRangePrettyfier(_singleTablePrettyfier.object);
    }
});