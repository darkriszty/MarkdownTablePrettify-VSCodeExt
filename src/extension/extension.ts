'use strict';
import * as vscode from 'vscode';
import { TableRangePrettyfier } from "./tableRangePrettyfier";
import { ConsoleLogger } from '../diagnostics/consoleLogger';
import { VsWindowLogger } from '../diagnostics/vsWindowLogger';
import { TableFactory } from "../modelFactory/tableFactory";
import { AlignmentFactory } from "../modelFactory/alignmentFactory";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableStringWriter } from "../writers/tableStringWriter";
import { ContentPadCalculator } from '../padCalculation/contentPadCalculator';
import { TableViewModelFactory } from '../viewModelFactories/tableViewModelFactory';
import { RowViewModelFactory } from '../viewModelFactories/rowViewModelFactory';
import { TrimmerTransformer } from '../modelFactory/transformers/trimmerTransformer';
import { BorderTransformer } from '../modelFactory/transformers/borderTransformer';
import { SelectionInterpreter } from '../modelFactory/selectionInterpreter';
import { SeparatorPadCalculator } from '../padCalculation/separatorPadCalculator';
import { PadCalculatorSelector } from '../padCalculation/padCalculatorSelector';

// This method is called when the extension is activated.
// The extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext): void {
    const MD_MODE: vscode.DocumentFilter = { language: "markdown", scheme: "file" };

    let disposable = vscode.languages.registerDocumentRangeFormattingEditProvider(
        MD_MODE, new TableRangePrettyfier(
            new TableFactory(
                new AlignmentFactory(),
                new SelectionInterpreter(),
                new TrimmerTransformer(new BorderTransformer(null)),
            ),
            new TableValidator(new SelectionInterpreter()),
            new TableViewModelFactory(
                new RowViewModelFactory(
                    new ContentPadCalculator(new PadCalculatorSelector(), " "), 
                    new SeparatorPadCalculator(new PadCalculatorSelector(), "-")
                )
            ),
            new TableStringWriter(),
            [ new VsWindowLogger(), new ConsoleLogger() ])
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
