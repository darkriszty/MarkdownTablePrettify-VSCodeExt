import * as assert from 'assert';
import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { TableDocumentRangePrettyfier } from "../../src/extension/tableDocumentRangePrettyfier";
import { TableFactory } from "../../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../../src/modelFactory/alignmentFactory";
import { TableValidator } from "../../src/modelFactory/tableValidator";
import { TableViewModelFactory } from "../../src/viewModelFactories/tableViewModelFactory";
import { RowViewModelFactory } from "../../src/viewModelFactories/rowViewModelFactory";
import { ContentPadCalculator } from "../../src/padCalculation/contentPadCalculator";
import { TableStringWriter } from "../../src/writers/tableStringWriter";
import { ILogger } from "../../src/diagnostics/logger";
import { ConsoleLogger } from '../../src/diagnostics/consoleLogger';
import { MarkdownTextDocumentStub } from "../stubs/markdownTextDocumentStub";
import { TrimmerTransformer } from '../../src/modelFactory/transformers/trimmerTransformer';
import { BorderTransformer } from '../../src/modelFactory/transformers/borderTransformer';
import { SelectionInterpreter } from '../../src/modelFactory/selectionInterpreter';
import { PadCalculatorSelector } from '../../src/padCalculation/padCalculatorSelector';
import { AlignmentMarkerStrategy } from '../../src/viewModelFactories/alignmentMarking';
import { TableDocumentPrettyfier } from '../../src/extension/tableDocumentPrettyfier';
import { TableFinder } from '../../src/tableFinding/tableFinder';

export class PrettyfierFromFile {
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

        assert.equal(actualLines.length, expectedLines.length);
        for (let i = 0; i < actualLines.length; i++)
            assert.equal(actualLines[i], expectedLines[i]);
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
            new TableFinder(new TableValidator(new SelectionInterpreter(true))),
            new TableDocumentRangePrettyfier(
                new TableFactory(
                    new AlignmentFactory(),
                    new SelectionInterpreter(false),
                    new TrimmerTransformer(new BorderTransformer(null))
                ),
                new TableValidator(new SelectionInterpreter(false)),
                new TableViewModelFactory(new RowViewModelFactory(
                    new ContentPadCalculator(new PadCalculatorSelector(), " "), 
                    new AlignmentMarkerStrategy(":")
                )),
                new TableStringWriter(),
                [ this._logger ]
            )
        );
    }
}