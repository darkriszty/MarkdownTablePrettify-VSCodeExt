import * as assert from 'assert';
import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import { Mock } from "typemoq";
import { TableRangePrettyfier } from "../../src/extension/tableRangePrettyfier";
import { TableFactory } from "../../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../../src/modelFactory/alignmentFactory";
import { TableValidator } from "../../src/modelFactory/tableValidator";
import { TableViewModelFactory } from "../../src/viewModelFactories/tableViewModelFactory";
import { RowViewModelFactory } from "../../src/viewModelFactories/rowViewModelFactory";
import { PadCalculator } from "../../src/padCalculator";
import { TableStringWriter } from "../../src/writers/tableStringWriter";
import { ILogger } from "../../src/diagnostics/logger";
import { ConsoleLogger } from '../../src/diagnostics/consoleLogger';
import { MarkdownTextDocumentStub } from "../stubs/markdownTextDocumentStub";
import { TrimmerTransformer } from '../../src/modelFactory/transformers/trimmerTransformer';
import { BorderTransformer } from '../../src/modelFactory/transformers/borderTransformer';
import { SelectionInterpreter } from '../../src/modelFactory/selectionInterpreter';

export class PrettyfierFromFile {
    private readonly _logger: ILogger;

    constructor(logger: ILogger = null) {
        this._logger = logger == null ? new ConsoleLogger() : logger;
    }

    public assertPrettyfiedAsExpected(fileNamePrefix: string): void {
        this.assertEditsPrettyfied(
            this.makeTextEdit(this.readFileContents(`${fileNamePrefix}-input.md`)),
            this.readFileContents(`${fileNamePrefix}-expected.md`)
        );
    }

    private assertEditsPrettyfied(edits: vscode.TextEdit[], expected: string): void {
        assert.equal(edits.length, 1);
        const expectedLines = expected.split(/\r\n|\r|\n/);
        const actualLines = edits[0].newText.split(/\r\n|\r|\n/);
        assert.equal(expectedLines.length == actualLines.length && expectedLines.every((l,i) => l === actualLines[i]), true);
    }

    private makeTextEdit(fileContents: string): vscode.TextEdit[] {
        const doc = new MarkdownTextDocumentStub(fileContents);
        return this.createPrettyfier().provideDocumentRangeFormattingEdits(doc, doc.getFullRange(), null, null);
    }

    private readFileContents(fileName: string) {
        return fs.readFileSync(path.resolve(__dirname, fileName), 'utf-8');
    }

    private createPrettyfier(): TableRangePrettyfier {
        return new TableRangePrettyfier(
            new TableFactory(
                new AlignmentFactory(),
                new SelectionInterpreter(),
                new TrimmerTransformer(new BorderTransformer(null))
            ),
            new TableValidator(new SelectionInterpreter()),
            new TableViewModelFactory(new RowViewModelFactory(new PadCalculator())),
            new TableStringWriter(),
            [ this._logger ]
        );
    }
}