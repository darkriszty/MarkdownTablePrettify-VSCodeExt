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
/*
    test("provideDocumentRangeFormattingEdits() table factory called with invalid table then logInfo() called", () => {
        const tableText = "hello world";
        const mockTableFactory: TypeMoq.IMock<ITableFactory> = TypeMoq.Mock.ofType<ITableFactory>();
        const mockLogger: TypeMoq.IMock<ILogger> = TypeMoq.Mock.ofType<ILogger>();
        mockTableFactory.setup(t => t.create(tableText)).returns(null).verifiable(Times.once());
        mockLogger.setup(t => t.logInfo(It.isAnyString())).verifiable(Times.once());
        const trp = new TableRangePrettyfier(mockTableFactory.object, mockLogger.object);
        const textDoc = new mockVsCode.MockMarkdownTextDocument(tableText);

        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, textDoc.getFullRange(), null, null);

        mockTableFactory.verifyAll();
        mockLogger.verifyAll();
    });
*/
});