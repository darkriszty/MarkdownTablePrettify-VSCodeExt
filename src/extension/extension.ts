'use strict';
import * as vscode from 'vscode';
import { TableRangePrettyfier } from "./tableRangePrettyfier";
import { VsWindowLogger } from "../diagnostics/logger";
import { TableFactory } from "../modelFactory/tableFactory";
import { AlignmentFactory } from "../modelFactory/alignmentFactory";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModelBuilder } from "../viewModelBuilders/tableViewModelBuilder";
import { TableStringWriter } from "../writers/tableStringWriter";
import { RowViewModelBuilder } from "../viewModelBuilders/rowViewModelBuilder";

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext): void {
    const MD_MODE: vscode.DocumentFilter = { language: "markdown", scheme: "file" };

    let disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(
        MD_MODE, new TableRangePrettyfier(
            new TableFactory(new AlignmentFactory()),
            new TableValidator(),
            new TableViewModelBuilder(new RowViewModelBuilder()),
            new TableStringWriter(),
            new VsWindowLogger())
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
