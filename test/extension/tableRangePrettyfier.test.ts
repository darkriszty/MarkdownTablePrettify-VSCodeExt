import * as assert from "assert";
import * as vscode from "vscode";
import * as typeMock from "typemoq";
import { It, Times } from "typemoq";
import { ITableFactory } from "../../src/models/tableFactory";
import { ILogger } from "../../src/diagnostics/logger";
import { TableRangePrettyfier } from "../../src/extension/tableRangePrettyfier";
import { MockMarkdownTextDocument } from "../mocks/mockMarkdownTextDocument";
import { ITable } from "../../src/models/table";

suite("TableRangePrettyfier tests", () => {

    test("provideDocumentRangeFormattingEdits() whole document selection returns empty text edits", () => {
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);
        const textDoc = new MockMarkdownTextDocument("hello world");

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, textDoc.getFullRange(), null, null);

        assert.equal(textEdits.length, 0);
    });

    test("provideDocumentRangeFormattingEdits() invalid table with whole document being formatted => logInfo() not called", () => {
        const tableText = `row1
                           row2
                           row3`;
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(0, 3);
        mockTableFactory
            .setup(t => t.create(textDoc.getText(range)))
            .returns(() => null)
            .verifiable(Times.once());
        mockLogger
            .setup(t => t.logInfo(It.isAnyString()))
            .verifiable(Times.never());

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, range, null, null);

        mockTableFactory.verifyAll();
        mockLogger.verifyAll();
    });

    test("provideDocumentRangeFormattingEdits() error thrown with whole document being formatted => logError() not called", () => {
        const tableText = `row1
                           row2
                           row3`;
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(0, 3);
        mockTableFactory
            .setup(t => t.create(textDoc.getText(range)))
            .throws(new Error("expected error"))
            .verifiable(Times.once());
        mockLogger
            .setup(t => t.logError(It.isAny()))
            .verifiable(Times.never());

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, range, null, null);

        mockTableFactory.verifyAll();
        mockLogger.verifyAll();
    });

    test("provideDocumentRangeFormattingEdits() error thrown without whole document being formatted => logError() called", () => {
        const tableText = `row1
                           row2
                           row3`;
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(2, 3);
        mockTableFactory
            .setup(t => t.create(textDoc.getText(range)))
            .throws(new Error("expected error"))
            .verifiable(Times.once());
        mockLogger
            .setup(t => t.logError(It.isAny()))
            .verifiable(Times.once());

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, range, null, null);

        mockTableFactory.verifyAll();
        mockLogger.verifyAll();
    });

    test("provideDocumentRangeFormattingEdits() invalid table with not the whole document being formatted => logInfo() called", () => {
        const tableText = `row1
                           row2
                           row3`;
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(2, 3);
        mockTableFactory
            .setup(t => t.create(textDoc.getText(range)))
            .returns(() => null)
            .verifiable(Times.once());
        mockLogger
            .setup(t => t.logInfo(It.isAnyString()))
            .verifiable(Times.once());

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, range, null, null);

        mockTableFactory.verifyAll();
        mockLogger.verifyAll();
    });

    test("provideDocumentRangeFormattingEdits() table prettyPrint() called and logInfo() not called", () => {
        const tableText = `row1
                           row2
                           row3`;
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const mockTable: typeMock.IMock<ITable> = typeMock.Mock.ofType<ITable>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(1, 3);

        mockTable
            .setup(t => t.prettyPrint())
            .verifiable(Times.once());
        mockTableFactory
            .setup(t => t.create(textDoc.getText(range)))
            .returns(() => mockTable.object)
            .verifiable(Times.once());
        mockLogger
            .setup(t => t.logInfo(It.isAnyString()))
            .verifiable(Times.never());

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, range, null, null);

        mockTable.verifyAll();
        mockTableFactory.verifyAll();
        mockLogger.verifyAll();
    });

    test("provideDocumentRangeFormattingEdits() the result of the prettyPrint() is returned", () => {
        const tableText = `row1
                           row2
                           row3`;
        const mockTableFactory: typeMock.IMock<ITableFactory> = typeMock.Mock.ofType<ITableFactory>();
        const mockLogger: typeMock.IMock<ILogger> = typeMock.Mock.ofType<ILogger>();
        const mockTable: typeMock.IMock<ITable> = typeMock.Mock.ofType<ITable>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(1, 3);

        mockTable
            .setup(t => t.prettyPrint())
            .returns(() => "foo bar");
        mockTableFactory
            .setup(t => t.create(textDoc.getText(range)))
            .returns(() => mockTable.object)
        mockLogger.setup(t => t.logInfo(It.isAnyString()));

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, range, null, null);

        assert.equal(textEdits.length, 1);
        assert.equal(textEdits[0].newText, "foo bar");
    });

});