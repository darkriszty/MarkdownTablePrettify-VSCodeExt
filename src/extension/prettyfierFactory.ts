import * as vscode from 'vscode';
import { ConfigSizeLimitChecker } from '../prettyfiers/sizeLimit/configSizeLimitCheker';
import { TableDocumentPrettyfier } from './tableDocumentPrettyfier';
import { TableDocumentPrettyfierCommand } from './tableDocumentPrettyfierCommand';
import { TableFinder } from '../tableFinding/tableFinder';
import { TableDocumentRangePrettyfier } from "./tableDocumentRangePrettyfier";
import { ILogger } from '../diagnostics/logger';
import { ConsoleLogger } from '../diagnostics/consoleLogger';
import { VsWindowLogger } from '../diagnostics/vsWindowLogger';
import { TableFactory } from "../modelFactory/tableFactory";
import { AlignmentFactory } from "../modelFactory/alignmentFactory";
import { TableValidator } from "../modelFactory/tableValidator";
import { ContentPadCalculator } from '../padCalculation/contentPadCalculator';
import { TableViewModelFactory } from '../viewModelFactories/tableViewModelFactory';
import { RowViewModelFactory } from '../viewModelFactories/rowViewModelFactory';
import { BorderTransformer } from '../modelFactory/transformers/borderTransformer';
import { TrimmerTransformer } from '../modelFactory/transformers/trimmerTransformer';
import { FairTableIndentationDetector } from '../modelFactory/tableIndentationDetector';
import { SelectionInterpreter } from '../modelFactory/selectionInterpreter';
import { PadCalculatorSelector } from '../padCalculation/padCalculatorSelector';
import { AlignmentMarkerStrategy } from '../viewModelFactories/alignmentMarking';
import { MultiTablePrettyfier } from '../prettyfiers/multiTablePrettyfier';
import { SingleTablePrettyfier } from '../prettyfiers/singleTablePrettyfier';
import { TableStringWriter } from "../writers/tableStringWriter";
import { ValuePaddingProvider } from '../writers/valuePaddingProvider';

export function getSupportLanguageIds() {
    return [ "markdown", ...getConfigurationValue<Array<string>>("extendedLanguages", []) ];
}

export function getDocumentRangePrettyfier() {
    return new TableDocumentRangePrettyfier(getMultiTablePrettyfier());
}

export function getDocumentPrettyfier(): vscode.DocumentFormattingEditProvider {
    return new TableDocumentPrettyfier(getMultiTablePrettyfier());
}

export function getDocumentPrettyfierCommand(): TableDocumentPrettyfierCommand {
    return new TableDocumentPrettyfierCommand(getMultiTablePrettyfier());
}

function getMultiTablePrettyfier(): MultiTablePrettyfier {
    const loggers = getLoggers();
    const sizeLimitCheker = getSizeLimitChecker(loggers);
    const columnPadding: number = getConfigurationValue<number>("columnPadding", 0);

    return new MultiTablePrettyfier(
        new TableFinder(new TableValidator(new SelectionInterpreter(true))),
        getSingleTablePrettyfier(loggers, sizeLimitCheker, columnPadding),
        sizeLimitCheker
    );
}

function getSingleTablePrettyfier(loggers: ILogger[], sizeLimitCheker: ConfigSizeLimitChecker, columnPadding: number): SingleTablePrettyfier {
    return new SingleTablePrettyfier(
        new TableFactory(
            new AlignmentFactory(),
            new SelectionInterpreter(false),
            new TrimmerTransformer(new BorderTransformer(null)),
            new FairTableIndentationDetector()
        ),
        new TableValidator(new SelectionInterpreter(false)),
        new TableViewModelFactory(new RowViewModelFactory(
            new ContentPadCalculator(new PadCalculatorSelector(), " "),
            new AlignmentMarkerStrategy(":")
        )),
        new TableStringWriter(new ValuePaddingProvider(columnPadding)),
        loggers,
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