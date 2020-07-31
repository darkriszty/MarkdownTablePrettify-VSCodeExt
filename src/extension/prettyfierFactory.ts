import * as vscode from 'vscode';
import { ConfigSizeLimitChecker } from '../prettyfiers/sizeLimit/configSizeLimitCheker';
import { TableDocumentPrettyfier } from './tableDocumentPrettyfier';
import { TableFinder } from '../tableFinding/tableFinder';
import { TableDocumentRangePrettyfier } from "./tableDocumentRangePrettyfier";
import { ILogger } from '../diagnostics/logger';
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

export function getDocumentRangePrettyfier(strict: boolean = false, sizeLimitCheker: ConfigSizeLimitChecker = null, loggers: ILogger[] = null) {
    loggers = loggers || getLoggers();
    sizeLimitCheker = sizeLimitCheker || getSizeLimitChecker(loggers);

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
        loggers,
        sizeLimitCheker
    );
}

export function getDocumentPrettyfier(strict: boolean = true): vscode.DocumentFormattingEditProvider {
    const loggers = getLoggers();
    const sizeLimitCheker = getSizeLimitChecker(loggers);

    return new TableDocumentPrettyfier(
        new TableFinder(new TableValidator(new SelectionInterpreter(strict))), 
        getDocumentRangePrettyfier(strict, sizeLimitCheker, loggers),
        sizeLimitCheker
    );
}

function getLoggers(): ILogger[] {
    const canShowWindowMessages = getConfigurationValue<boolean>("showWindowMessages", true);
    return [
        ...(canShowWindowMessages ? [ new VsWindowLogger() ] : []),
        new ConsoleLogger()
    ]
}

function getSizeLimitChecker(loggers: ILogger[]): ConfigSizeLimitChecker {
    const maxTextLength = getConfigurationValue<number>("maxTextLength", 1000000);
    return new ConfigSizeLimitChecker(loggers, maxTextLength);
}

function getConfigurationValue<T>(key: string, defaultValue: T): T {
    return vscode.workspace.getConfiguration("markdownTablePrettify").get(key, defaultValue);
}