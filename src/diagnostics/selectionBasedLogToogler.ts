import * as vscode from "vscode";
import { ILogger } from "../diagnostics/logger";

export class SelectionBasedLogToogler {
    constructor(
        private readonly _document: vscode.TextDocument, 
        private readonly _range: vscode.Range) { }

    public toogleLoggers(loggers: ILogger[]) {
        const logEnabled = !this._isWholeDocumentFormatting();
        for (const logger of loggers) {
            logger.setEnabled(logEnabled);
        }
    }

    private _isWholeDocumentFormatting(): boolean {
        if (this._document.lineCount < 1)
            return true;

        const zeroPosition = new vscode.Position(0, 0);
        const documentEndPosition = this._document.lineAt(this._document.lineCount - 1).range.end;
        if (this._range.start.isEqual(zeroPosition) && this._range.end.isEqual(documentEndPosition))
            return true;

        return false;
    }
}