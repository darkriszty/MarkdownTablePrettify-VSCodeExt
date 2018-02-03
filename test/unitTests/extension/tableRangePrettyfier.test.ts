import * as assert from "assert";
import * as vscode from "vscode";
import * as typeMock from "typemoq";
import { IMock, Mock, It, Times } from "typemoq";
import { TableRangePrettyfier } from "../../../src/extension/tableRangePrettyfier";
import { TableFactory } from "../../../src/modelFactory/tableFactory";
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { TableViewModelFactory } from "../../../src/viewModelFactories/tableViewModelFactory";
import { TableStringWriter } from "../../../src/writers/tableStringWriter";
import { ILogger } from "../../../src/diagnostics/logger";
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { CancellationTokenSource } from "vscode";
import { TableViewModel } from "../../../src/viewModels/tableViewModel";

suite("TableRangePrettyfier tests", () => {

    let _tableFactory: IMock<TableFactory>;
    let _tableValidator: IMock<TableValidator>;
    let _viewModelFactory: IMock<TableViewModelFactory>;
    let _writer: IMock<TableStringWriter>;
    let _logger: IMock<ILogger>;

    setup(() => {
        _tableFactory = Mock.ofType<TableFactory>();
        _tableValidator = Mock.ofType<TableValidator>();
        _viewModelFactory = Mock.ofType<TableViewModelFactory>();
        _writer = Mock.ofType<TableStringWriter>();
        _logger = Mock.ofType<ILogger>();
    });

    test("provideDocumentRangeFormattingEdits() uses table factory to create table from range of selection", () => {
        const sut = createSut();
        const text = "hello world";
        const document = makeDocument(text);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _tableFactory.verify(_ => _.getModel(text), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() calls table validator", () => {
        const sut = createSut();
        const text = "hello world";
        const document = makeDocument(text);
        const table = threeColumnTable();
        _tableFactory.setup(_ => _.getModel(text)).returns(() => table);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _tableValidator.verify(_ => _.isValid(table), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() calls view model factory for valid table", () => {
        const sut = createSut();
        const document = makeDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _viewModelFactory.verify(_ => _.build(It.isAny()), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() calls table writer with view model", () => {
        const sut = createSut();
        const document = makeDocument("hello world");
        const viewModel = new TableViewModel();
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);
        _viewModelFactory.setup(_ => _.build(It.isAny())).returns(() => viewModel);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _writer.verify(_ => _.writeTable(viewModel), Times.once());
    });

    test("provideDocumentRangeFormattingEdits() result contains table writer output", () => {
        const sut = createSut();
        const document = makeDocument("hello world");
        const viewModel = new TableViewModel();
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => true);
        _writer.setup(_ => _.writeTable(It.isAny())).returns(() => "foo bar");

        const edits = sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        assert.equal(edits.length, 1);
        assert.equal(edits[0].newText, "foo bar");
    });

    test("provideDocumentRangeFormattingEdits() doesn't call view model factory for invalid table", () => {
        const sut = createSut();
        const document = makeDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _viewModelFactory.verify(_ => _.build(It.isAny()), Times.never());
    });

    test("provideDocumentRangeFormattingEdits() doesn't call table writer for invalid table", () => {
        const sut = createSut();
        const document = makeDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _writer.verify(_ => _.writeTable(It.isAny()), Times.never());
    });

    test("provideDocumentRangeFormattingEdits() call logInfo for invalid table", () => {
        const sut = createSut();
        const document = makeDocument("hello world");
        _tableValidator.setup(_ => _.isValid(It.isAny())).returns(() => false);

        sut.provideDocumentRangeFormattingEdits(document, document.getFullRange(), null, null);

        _logger.verify(_ => _.logInfo(It.isAny()), Times.once());
    });

    function threeColumnTable(): Table {
        return new Table(
            [
                [ "aaaaa", "bbbbb", "ccccc" ],
                [ "-", "-", "-" ],
                [ "aaaaa", "bbbbb", "ccccc" ]
            ], 
            [ Alignment.Left, Alignment.Left, Alignment.Left]
        );
    }

    function makeDocument(fileContents) {
        return new MarkdownTextDocumentStub(fileContents);
    }

    function createSut() {
        return new TableRangePrettyfier(_tableFactory.object, _tableValidator.object, _viewModelFactory.object, _writer.object, [ _logger.object ]);
    }
});