'use strict';
import * as vscode from 'vscode';
import { getDocumentRangePrettyfier, getDocumentPrettyfier } from './prettyfierFactory';

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext): void {
    const MD_MODE: vscode.DocumentFilter = { language: "markdown" };

    context.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(MD_MODE, getDocumentRangePrettyfier()),
        vscode.languages.registerDocumentFormattingEditProvider(MD_MODE, getDocumentPrettyfier())
    );
}

export function deactivate() { }
