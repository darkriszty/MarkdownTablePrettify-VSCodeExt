import * as vscode from "vscode";
import * as assert from "assert";
import { IMock, Mock, Times, It } from "typemoq";
import { TableDocumentPrettyfier } from "../../../src/extension/tableDocumentPrettyfier";
import { TableDocumentRangePrettyfier } from "../../../src/extension/tableDocumentRangePrettyfier";
import { SizeLimitChecker } from "../../../src/prettyfiers/sizeLimit/sizeLimitChecker";
import { TableFinder } from "../../../src/tableFinding/tableFinder";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { Range } from "../../../src/models/doc/range";

suite("TableDocumentPrettyfier tests", () => {

    let _tableFinder: IMock<TableFinder>;
    let _tableDocumentRangePrettyfier: IMock<TableDocumentRangePrettyfier>;
    let _sizeLimitChecker: IMock<SizeLimitChecker>;

    setup(() => {
        _tableFinder = Mock.ofType<TableFinder>();
        _tableDocumentRangePrettyfier = Mock.ofType<TableDocumentRangePrettyfier>();
        _sizeLimitChecker = Mock.ofType<SizeLimitChecker>()
    });

    test("provideDocumentFormattingEdits() calls size limit checker", () => {
        const sut = createSut();
        const text = "hello world";
        const document = new MarkdownTextDocumentStub(text);

        sut.provideDocumentFormattingEdits(document, null, null);

        _sizeLimitChecker.verify(checker => checker.isWithinAllowedSizeLimit(text), Times.once());
    });

    test("provideDocumentFormattingEdits() doesn't format when size exceeds allowed limit", () => {
        const sut = createSut();
        const text = "hello world";
        const document = new MarkdownTextDocumentStub(text);
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => false);

        sut.provideDocumentFormattingEdits(document, null, null);

        _tableFinder.verify(tableFind => tableFind.getNextRange(It.isAny(), It.isAny()), Times.never());
    });

    test("provideDocumentFormattingEdits() tries to get the next table range until exhausted", () => {
        const sut = createSut();
        const text = "hello world";
        const document = new MarkdownTextDocumentStub(text);
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => true);
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 0)).returns(() => new Range(1, 2));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 3)).returns(() => new Range(10, 20));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 21)).returns(() => new Range(100, 200));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 201)).returns(() => null);

        sut.provideDocumentFormattingEdits(document, null, null);

        _tableFinder.verify(tableFinder => tableFinder.getNextRange(It.isAny(), It.isAny()), Times.exactly(4));
    });

    test("provideDocumentFormattingEdits() calls range prettyfier for each table range found", () => {
        const sut = createSut();
        const text = "hello world";
        const document = new MarkdownTextDocumentStub(text);
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => true);
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 0)).returns(() => new Range(1, 2));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 3)).returns(() => new Range(10, 20));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 21)).returns(() => new Range(100, 200));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 201)).returns(() => null);

        sut.provideDocumentFormattingEdits(document, null, null);

        _tableDocumentRangePrettyfier.verify(rangePrettyfier => rangePrettyfier.provideDocumentRangeFormattingEdits(It.isAny(), It.isAny(), It.isAny(), It.isAny()), Times.exactly(3));
    });

    test("provideDocumentFormattingEdits() builds the result from the prettyfier result of each table", () => {
        const sut = createSut();
        const text = "hello world";
        const document = new MarkdownTextDocumentStub(text);
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => true);
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 0)).returns(() => new Range(1, 2));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 3)).returns(() => new Range(10, 20));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 21)).returns(() => new Range(100, 200));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 201)).returns(() => null);
        _tableDocumentRangePrettyfier
            .setup(rangePrettyfier => rangePrettyfier.provideDocumentRangeFormattingEdits(It.isAny(), It.is<vscode.Range>(r => r.start.line === 1), It.isAny(), It.isAny()))
            .returns(() => makeTextEditsStub("a"));
        _tableDocumentRangePrettyfier
            .setup(rangePrettyfier => rangePrettyfier.provideDocumentRangeFormattingEdits(It.isAny(), It.is<vscode.Range>(r => r.start.line === 10), It.isAny(), It.isAny()))
            .returns(() => makeTextEditsStub("b"));
        _tableDocumentRangePrettyfier
            .setup(rangePrettyfier => rangePrettyfier.provideDocumentRangeFormattingEdits(It.isAny(), It.is<vscode.Range>(r => r.start.line === 100), It.isAny(), It.isAny()))
            .returns(() => makeTextEditsStub("c"));

        const result = sut.provideDocumentFormattingEdits(document, null, null);

        assert.equal(result.length, 3);
        assert.equal(result.map(edit => edit.newText).join(""), "abc");
    });

    function createSut() {
        return new TableDocumentPrettyfier(
            _tableFinder.object,
            _tableDocumentRangePrettyfier.object,
            _sizeLimitChecker.object);
    }

    function makeTextEditsStub(text: string): vscode.TextEdit[] {
        return [ new vscode.TextEdit(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), text) ];
    }
});