import * as vscode from 'vscode';
import { Table } from "./table";

export class TableRangePrettyfier implements vscode.DocumentRangeFormattingEditProvider {
    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument, range: vscode.Range,
        options: vscode.FormattingOptions, token: vscode.CancellationToken) : vscode.TextEdit[]
    {
        const result: vscode.TextEdit[] = [];
        const selection = document.getText(range);

        // this extension only works on selected tables, not on the entire document
        const isWholeDocumentFormatting = this.isWholeDocumentFormatting(document, range);
        if (!isWholeDocumentFormatting) {
            let message: string = null;
            let table: Table = null;

            try {
                table = Table.create(selection);
                if (table == null) {
                    message = "Mismatching table column sizes.";
                }
                else {
                    const formattedTable = table.prettyPrint();
                    result.push(new vscode.TextEdit(range, formattedTable));
                }

            }
            catch (ex) {
                message = (<Error>ex).message;
                console.error(ex);
            }

            if (!!message)
                vscode.window.showInformationMessage(message);
        }

        return result;
    }

    private isWholeDocumentFormatting(document: vscode.TextDocument, range: vscode.Range): boolean {
        if (document.lineCount < 1)
            return true;

        const zeroPosition = new vscode.Position(0, 0);
        const documentEndPosition = document.lineAt(document.lineCount - 1).range.end;
        if (range.start.isEqual(zeroPosition) && range.end.isEqual(documentEndPosition))
            return true;

        return false;
    }
}