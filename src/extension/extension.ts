'use strict';
import * as vscode from 'vscode';
import { TableRangePrettyfier } from "./tableRangePrettyfier";
import { TableFactory } from "../table/tableFactory";
import { VsWindowLogger } from "../diagnostics/logger";

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext): void {
    const MD_MODE: vscode.DocumentFilter = { language: "markdown", scheme: "file" };

    let disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(
        MD_MODE, new TableRangePrettyfier(new TableFactory(), new VsWindowLogger())
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
