import * as assert from "assert";
import * as vscode from "vscode";
import * as mockVsCode from "./mockVsCodeClasses";
import { TableRangePrettyfier } from "../src/tableRangePrettyfier";
import { ITableFactory } from "../src/tableFactory";
import { ITable } from "../src/table";
import { ILogger } from "../src/logger";
import * as TypeMoq from "typemoq";
import { It, Times } from "typemoq";

suite("TableRangePrettyfier tests", () => {

    test("provideDocumentRangeFormattingEdits() whole document selection returns empty text edits", () => {
        const mockTableFactory: TypeMoq.IMock<ITableFactory> = TypeMoq.Mock.ofType<ITableFactory>();
        const mockLogger: TypeMoq.IMock<ILogger> = TypeMoq.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);
        const textDoc = new mockVsCode.MockMarkdownTextDocument("hello world");

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, textDoc.getFullRange(), null, null);

        assert.equal(textEdits.length, 0);
    });

    test("provideDocumentRangeFormattingEdits() table factory called with invalid table then logInfo() called", () => {
        const tableText = `
hello | world
-|-
new | line
`;
        const mockTableFactory: TypeMoq.IMock<ITableFactory> = TypeMoq.Mock.ofType<ITableFactory>();
        const mockLogger: TypeMoq.IMock<ILogger> = TypeMoq.Mock.ofType<ILogger>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new mockVsCode.MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(1, 4);
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
        const tableText = `
hello | world
-|-
new | line
`;
        const mockTableFactory: TypeMoq.IMock<ITableFactory> = TypeMoq.Mock.ofType<ITableFactory>();
        const mockLogger: TypeMoq.IMock<ILogger> = TypeMoq.Mock.ofType<ILogger>();
        const mockTable: TypeMoq.IMock<ITable> = TypeMoq.Mock.ofType<ITable>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new mockVsCode.MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(1, 4);

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
        const tableText = `
hello | world
-|-
new | line
`;
        const mockTableFactory: TypeMoq.IMock<ITableFactory> = TypeMoq.Mock.ofType<ITableFactory>();
        const mockLogger: TypeMoq.IMock<ILogger> = TypeMoq.Mock.ofType<ILogger>();
        const mockTable: TypeMoq.IMock<ITable> = TypeMoq.Mock.ofType<ITable>();
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);

        const textDoc = new mockVsCode.MockMarkdownTextDocument(tableText);
        const range = textDoc.getRangeForLines(1, 4);

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