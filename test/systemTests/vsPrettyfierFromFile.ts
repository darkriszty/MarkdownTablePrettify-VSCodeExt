import * as assert from 'assert';
import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
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

export class VsPrettyfierFromFile {
    private readonly _logger: ILogger;

    constructor(logger: ILogger = null) {
        this._logger = logger == null ? new ConsoleLogger() : logger;
    }

    public assertPrettyfiedAsExpected(fileNamePrefix: string): void {
        vscode.workspace.openTextDocument(`${fileNamePrefix}-input.md`)
            .then(inputDocument => {
                const edits = this.formatFile(inputDocument);
                const expectedFileContents = this.readFileContents(`${fileNamePrefix}-expected.md`);
                this.assertEditsPrettyfied(inputDocument, edits, expectedFileContents);
            });
    }

    private assertEditsPrettyfied(inputDocument: vscode.TextDocument, edits: vscode.TextEdit[], expected: string): void {
        let actual = inputDocument.getText();
        for (let edit of edits) {
            const startIndex = inputDocument.offsetAt(edit.range.start);
            const endIndex = inputDocument.offsetAt(inputDocument.validatePosition(edit.range.end));
            actual = actual.substring(0, startIndex) + edit.newText + actual.substring(endIndex);
        }

        const expectedLines = expected.split(/\r\n|\r|\n/);
        const actualLines = actual.split(/\r\n|\r|\n/);

        assert.strictEqual(actualLines.length, expectedLines.length);
        for (let i = 0; i < actualLines.length; i++)
            assert.strictEqual(actualLines[i], expectedLines[i]);
    }

    private formatFile(doc: vscode.TextDocument): vscode.TextEdit[] {
        return this.createPrettyfier().provideDocumentFormattingEdits(doc, null, null);
    }

    private readFileContents(fileName: string) {
        return fs.readFileSync(this.pathFor(fileName), 'utf-8');
    }

    private pathFor(fileName: string) {
        return path.resolve(__dirname, fileName);
    }

    private createPrettyfier(): TableDocumentPrettyfier {
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
                    new TableStringWriter(),
                    [ this._logger ],
                    new ConfigSizeLimitChecker([ this._logger ], 50000)
                ),
                new ConfigSizeLimitChecker([ this._logger ], 50000)
            )
        );
    }
}