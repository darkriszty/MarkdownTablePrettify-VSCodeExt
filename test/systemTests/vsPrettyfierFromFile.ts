import * as assert from 'assert';
import * as vscode from "vscode";
import { readFileContents } from './systemTestFileReader';
import { ConfigSizeLimitChecker } from '../../src/prettyfiers/sizeLimit/configSizeLimitCheker';
import { TableDocumentPrettyfier } from '../../src/extension/tableDocumentPrettyfier';
import { ILogger } from "../../src/diagnostics/logger";
import { ConsoleLogger } from '../../src/diagnostics/consoleLogger';
import { AlignmentFactory } from "../../src/modelFactory/alignmentFactory";
import { SelectionInterpreter } from '../../src/modelFactory/selectionInterpreter';
import { TrimmerTransformer } from '../../src/modelFactory/transformers/trimmerTransformer';
import { BorderTransformer } from '../../src/modelFactory/transformers/borderTransformer';
import { TableFactory } from "../../src/modelFactory/tableFactory";
import { TableValidator } from "../../src/modelFactory/tableValidator";
import { ContentPadCalculator } from "../../src/padCalculation/contentPadCalculator";
import { PadCalculatorSelector } from '../../src/padCalculation/padCalculatorSelector';
import { TableFinder } from '../../src/tableFinding/tableFinder';
import { AlignmentMarkerStrategy } from '../../src/viewModelFactories/alignmentMarking';
import { RowViewModelFactory } from "../../src/viewModelFactories/rowViewModelFactory";
import { TableViewModelFactory } from "../../src/viewModelFactories/tableViewModelFactory";
import { TableStringWriter } from "../../src/writers/tableStringWriter";
import { MultiTablePrettyfier } from '../../src/prettyfiers/multiTablePrettyfier';
import { SingleTablePrettyfier } from '../../src/prettyfiers/singleTablePrettyfier';
import { FairTableIndentationDetector } from '../../src/modelFactory/tableIndentationDetector';
import { ValuePaddingProvider } from '../../src/writers/valuePaddingProvider';
import { MarkdownTextDocumentStub } from '../stubs/markdownTextDocumentStub';
import SystemTestsConfig from './systemTestsConfig';

export class VsPrettyfierFromFile {
    private readonly _logger: ILogger;

    constructor(logger: ILogger | null = null) {
        this._logger = logger == null ? new ConsoleLogger() : logger;
    }

    public assertPrettyfiedAsExpected(fileNameRoot: string): void {
        const inputFileContents = readFileContents(`${fileNameRoot}-input.md`);
        const inputDocument = new MarkdownTextDocumentStub(inputFileContents);
        const edits = this.formatFile(inputDocument, fileNameRoot);
        const expectedFileContents = readFileContents(`${fileNameRoot}-expected.md`);
        this.assertEditsPrettyfied(edits, expectedFileContents);
    }

    private assertEditsPrettyfied(edits: vscode.TextEdit[], expected: string): void {
        assert.strictEqual(edits.length, 1, "Expected exactly one edit replacing the entire document");
        const actual = edits[0].newText;

        const expectedLines = expected.split(/\r\n|\r|\n/);
        const actualLines = actual.split(/\r\n|\r|\n/);

        assert.strictEqual(actualLines.length, expectedLines.length);
        for (let i = 0; i < actualLines.length; i++)
            assert.strictEqual(actualLines[i], expectedLines[i]);
    }

    private formatFile(doc: vscode.TextDocument, fileNameRoot: string): vscode.TextEdit[] {
        return this.createPrettyfier(SystemTestsConfig.getColumnPaddingFor(fileNameRoot)).provideDocumentFormattingEdits(doc, null!, null!);
    }

    private createPrettyfier(columnPadding: number): TableDocumentPrettyfier {
        return new TableDocumentPrettyfier(
            new MultiTablePrettyfier(
                new TableFinder(new TableValidator(new SelectionInterpreter(true))),
                new SingleTablePrettyfier(
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
                    [ this._logger ],
                    new ConfigSizeLimitChecker([ this._logger ], 48000)
                ),
                new ConfigSizeLimitChecker([ this._logger ], 48000)
            )
        );
    }
}