'use strict';
import * as vscode from 'vscode';
import { TableRangePrettyfier } from "./tableRangePrettyfier";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
    const MD_MODE: vscode.DocumentFilter = { language: "markdown", scheme: "file" };
    let disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(
        MD_MODE, new TableRangePrettyfier()
    );

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
