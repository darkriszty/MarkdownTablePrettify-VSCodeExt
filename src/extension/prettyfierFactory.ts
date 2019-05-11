import * as vscode from 'vscode';
import { TableDocumentPrettyfier } from './tableDocumentPrettyfier';
import { TableFinder } from '../tableFinding/tableFinder';
import { TableDocumentRangePrettyfier } from "./tableDocumentRangePrettyfier";
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
import { PadCalculatorSelector } from '../padCalculation/padCalculatorSelector';
import { AlignmentMarkerStrategy } from '../viewModelFactories/alignmentMarking';

export function getDocumentRangePrettyfier(strict: boolean = false) {
    return new TableDocumentRangePrettyfier(
        new TableFactory(
            new AlignmentFactory(), new SelectionInterpreter(strict), 
            new TrimmerTransformer(new BorderTransformer(null))
        ),
        new TableValidator(new SelectionInterpreter(strict)),
        new TableViewModelFactory(
            new RowViewModelFactory(
                new ContentPadCalculator(new PadCalculatorSelector(), " "), 
                new AlignmentMarkerStrategy(":")
            )
        ),
        new TableStringWriter(),
        [
            ...(canShowWindowMessages() ? [ new VsWindowLogger() ] : []),
            new ConsoleLogger()
        ]
    );
}

export function getDocumentPrettyfier(strict: boolean = true): vscode.DocumentFormattingEditProvider {
    return new TableDocumentPrettyfier(
        new TableFinder(new TableValidator(new SelectionInterpreter(strict))), 
        getDocumentRangePrettyfier(strict)
    );
}

function canShowWindowMessages(): boolean {
    return getConfigurationValue<boolean>("showWindowMessages", true);
}

function getConfigurationValue<T>(key: string, defaultValue: T): T {
    return vscode.workspace.getConfiguration("markdownTablePrettify").get(key, defaultValue);
}