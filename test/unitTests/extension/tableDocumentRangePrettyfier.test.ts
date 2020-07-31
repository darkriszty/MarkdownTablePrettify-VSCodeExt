import * as assert from "assert";
import { IMock, Mock, It, Times } from "typemoq";
import { TableDocumentRangePrettyfier } from "../../../src/extension/tableDocumentRangePrettyfier";
import { SizeLimitChecker } from "../../../src/prettyfiers/sizeLimitCheker";
import { TableFactory } from "../../../src/modelFactory/tableFactory";
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { TableViewModelFactory } from "../../../src/viewModelFactories/tableViewModelFactory";
import { TableStringWriter } from "../../../src/writers/tableStringWriter";
import { ILogger } from "../../../src/diagnostics/logger";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { TableViewModel } from "../../../src/viewModels/tableViewModel";

suite("TableDocumentRangePrettyfier tests", () => {

    let _tableFactory: IMock<TableFactory>;
    let _tableValidator: IMock<TableValidator>;
    let _viewModelFactory: IMock<TableViewModelFactory>;
    let _writer: IMock<TableStringWriter>;
    let _logger: IMock<ILogger>;
    let _sizeLimitChecker: IMock<SizeLimitChecker>;

    setup(() => {
        _tableFactory = Mock.ofType<TableFactory>();
        _tableValidator = Mock.ofType<TableValidator>();
        _viewModelFactory = Mock.ofType<TableViewModelFactory>();
        _writer = Mock.ofType<TableStringWriter>();
        _logger = Mock.ofType<ILogger>();
        _sizeLimitChecker = Mock.ofType<SizeLimitChecker>()
    });

    test("provideDocumentRangeFormattingEdits() calls table validator", () => {
        const sut = createSut();
        const text = "hello world";
        const document = makeVsDocument(text);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _tableValidator.verify(_ => _.isValid(text), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() uses table factory to create table from range of selection for valid selection", () => {
        const sut = createSut();
        const text = "hello world";
        const vsDocument = makeVsDocument(text);
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _tableFactory.verify(_ => _.getModel(It.isAny(), It.isAny()), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() calls view model factory for valid table", () => {
        const sut = createSut();
        const document = makeVsDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _viewModelFactory.verify(_ => _.build(It.isAny()), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() calls table writer with view model", () => {
        const sut = createSut();
        const vsDocument = makeVsDocument("hello world");
        const viewModel = new TableViewModel();
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);
        _viewModelFactory.setup(_ => _.build(It.isAny())).returns(() => viewModel);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _writer.verify(_ => _.writeTable(viewModel), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() result contains table writer output", () => {
        const sut = createSut();
        const vsDocument = makeVsDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);
        _writer.setup(_ => _.writeTable(It.isAny())).returns(() => "foo bar");

        const edits = sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        assert.equal(edits.length, 1);
        assert.equal(edits[0].newText, "foo bar");
    });

    test("provideDocumentRangeFormattingEdits() doesn't call table factory for invalid table", () => {
        const sut = createSut();
        const text = "hello world";
        const vsDocument = makeVsDocument(text);
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _tableFactory.verify(_ => _.getModel(It.isAny(), It.isAny()), Times.never());
    });

    test("provideDocumentRangeFormattingEdits() doesn't call view model factory for invalid table", () => {
        const sut = createSut();
        const vsDocument = makeVsDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _viewModelFactory.verify(_ => _.build(It.isAny()), Times.never());
    });

    test("provideDocumentRangeFormattingEdits() doesn't call table writer for invalid table", () => {
        const sut = createSut();
        const vsDocument = makeVsDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _writer.verify(_ => _.writeTable(It.isAny()), Times.never());
    });

    test("provideDocumentRangeFormattingEdits() call logInfo for invalid table", () => {
        const sut = createSut();
        const vsDocument = makeVsDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _logger.verify(_ => _.logInfo(It.isAny()), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() doesn't call table writer for input too large", () => {
        const sut = createSut(false);
        const vsDocument = makeVsDocument("hello");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(vsDocument, vsDocument.getFullRange(), null, null);

        _writer.verify(_ => _.writeTable(It.isAny()), Times.never());
    });

    function makeVsDocument(fileContents) {
        return new MarkdownTextDocumentStub(fileContents);
    }

    function createSut(sizeWithinLimit: boolean = true) {
        _sizeLimitChecker.setup(_ => _.isWithinAllowedSizeLimit(It.isAny())).returns(() => sizeWithinLimit);

        return new TableDocumentRangePrettyfier(
            _tableFactory.object,
            _tableValidator.object,
            _viewModelFactory.object,
            _writer.object,
            [ _logger.object ],
            _sizeLimitChecker.object);
    }
});