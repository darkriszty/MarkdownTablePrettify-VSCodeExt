import * as vscode from "vscode";
import * as os from "os";
import { MockTextLine } from "./mockTextLine";

export class MockMarkdownTextDocument implements vscode.TextDocument {
    private _lines: string[];
    uri: vscode.Uri;
    fileName: string;
    isUntitled: boolean;
    languageId: string;
    version: number;
    isDirty: boolean;
    lineCount: number;

    constructor(text: string) {
        this._lines = text.split(/\r\n|\r|\n/);
        this.lineCount = this._lines.length;

        this.fileName = "test.md";
        this.isUntitled = false;
        this.languageId = "markdown";
        this.version = 1;
        this.isDirty = false;
    }

    getFullRange(): vscode.Range {
        return this.getRangeForLines(0, this._lines.length);
    }

    getRangeForLines(startLine: number, endLine: number): vscode.Range {
        return new vscode.Range(
            new vscode.Position(startLine, 0),
            new vscode.Position(endLine, this._lines[endLine - 1].length)
        );
    }

    lineAt(param: number): vscode.TextLine;
    lineAt(param: vscode.Position): vscode.TextLine;
    lineAt(param: any) {
        const lineNumber = param * 1;
        const lineRange = this.getRangeForLines(lineNumber, lineNumber + 1);
        return new MockTextLine(lineNumber, this._lines[lineNumber], lineRange);
    }

    getText(range?: vscode.Range): string {
        let buffer: string = "";
        for (let row = range.start.line; row < range.end.line; row++) {
            const isFirstRow = row == range.start.line;
            const isLastRow = row == range.end.line - 1;
            const line = this._lines[row];

            if (isFirstRow)
                buffer = line.substring(range.start.character);
            else if (isFirstRow && isLastRow)
                break;
            else
                buffer += line.substring(0, range.end.character);
            if (!isLastRow)
                buffer += os.EOL;
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
        return new vscode.Range[0];
    }
    positionAt(offset: number): vscode.Position {
        return new vscode.Position[0];
    }
    validatePosition(position: vscode.Position): vscode.Position {
        return new vscode.Position[0];
    }
}