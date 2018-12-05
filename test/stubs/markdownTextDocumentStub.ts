import * as vscode from "vscode";
import { EOL } from "os";
import { TextLineStub } from "./textLineStub";

export class MarkdownTextDocumentStub implements vscode.TextDocument {
    private _lines: string[];
    uri: vscode.Uri;
    fileName: string;
    isUntitled: boolean;
    languageId: string;
    version: number;
    isDirty: boolean;
    lineCount: number;

    constructor(text: string) {
        this.setLines(text);

        this.fileName = "test.md";
        this.isUntitled = false;
        this.languageId = "markdown";
        this.version = 1;
        this.isDirty = false;
    }

    private setLines(text: string) {
        this._lines = text.split(/\r\n|\r|\n/);
        this.lineCount = this._lines.length;
    }

    getFullRange(): vscode.Range {
        return this.getRangeForLines(0, this._lines.length - 1);
    }

    getRangeForLines(startLine: number, endLine: number): vscode.Range {
        return new vscode.Range(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, this._lines[endLine].length)
        );
    }

    applyEdits(edits: vscode.TextEdit[]): void {
        let original = this._lines.join(EOL);
        for (let edit of edits) {
            const startIndex = this.indexOf(edit.range.start);
            const endIndex = this.indexOf(edit.range.end);
            original = original.substring(0, startIndex) + edit.newText + original.substring(endIndex);
        }
        this.setLines(original);
    }

    indexOf(position: vscode.Position): number {
        let result = 0;
        for (let i = 0; i < position.line; i++) {
            result += this._lines[i].length;
        }
        result += position.character;
        return result;
    }

    lineAt(param: number): vscode.TextLine;
    lineAt(param: vscode.Position): vscode.TextLine;
    lineAt(param: any) {
        const lineNumber = param * 1;
        const lineRange = this.getRangeForLines(lineNumber, lineNumber);
        return new TextLineStub(lineNumber, this._lines[lineNumber], lineRange);
    }

    getText(range?: vscode.Range): string {
        range = range == null ? this.getFullRange() : range;
        let buffer: string = "";
        for (let row = range.start.line; row <= range.end.line; row++) {
            const isFirstRow = row == range.start.line;
            const isLastRow = row == range.end.line;
            const line = this._lines[row];

            if (isFirstRow)
                buffer = line.substring(range.start.character);
            else if (isFirstRow && isLastRow)
                break;
            else if (!isLastRow)
                buffer += line;
            else if (isLastRow)
                buffer += line.substring(0, range.end.character);

            if (!isLastRow)
                buffer += EOL;
        }
        return buffer;
    }

    save(): Thenable<boolean> {
        return new Promise(() => true);
    }
    offsetAt(position: vscode.Position): number {
        return 0;
    }
    getWordRangeAtPosition(position: vscode.Position): vscode.Range {
        return new vscode.Range[0];
    }
    validateRange(range: vscode.Range): vscode.Range {
        return range;
    }
    positionAt(offset: number): vscode.Position {
        return new vscode.Position[0];
    }
    validatePosition(position: vscode.Position): vscode.Position {
        return position;
    }
}