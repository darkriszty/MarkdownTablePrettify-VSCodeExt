import * as vscode from "vscode";

export class TextLineStub implements vscode.TextLine {
    constructor(lineNumber: number, text: string, range: vscode.Range) {
        this.lineNumber = lineNumber;
        this.text = text;
        this.range = range;
    }

    lineNumber: number;
    text: string;
    range: vscode.Range;
    rangeIncludingLineBreak: vscode.Range;
    firstNonWhitespaceCharacterIndex: number;
    isEmptyOrWhitespace: boolean;
}