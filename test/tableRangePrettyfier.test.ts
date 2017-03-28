import * as assert from 'assert';
import * as vscode from 'vscode';
import * as mockVsCode from "./mockVsCodeClasses";
import { TableRangePrettyfier } from "../src/tableRangePrettyfier";

suite("TableRangePrettyfier tests", () => {

    test("provideDocumentRangeFormattingEdits() whole document selection returns empty text edits", () => {
        const trp = new TableRangePrettyfier();
        const textDoc = new mockVsCode.MockMarkdownTextDocument("hello world");
        const textEdits = trp.provideDocumentRangeFormattingEdits(textDoc, textDoc.getFullRange(), null, null);

        assert.equal(textEdits.length, 0);
    });
});