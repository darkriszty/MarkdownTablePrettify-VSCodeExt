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
import { PadCalculator } from "../../src/viewModelFactories/padCalculator";
import { TableStringWriter } from "../../src/writers/tableStringWriter";
import { ILogger } from "../../src/diagnostics/logger";
import { MarkdownTextDocumentStub } from "../stubs/markdownTextDocumentStub";

export class PrettyfierFromFile {
    private readonly _logger: ILogger;

    constructor(logger: ILogger = null) {
        this._logger = logger == null ? Mock.ofType<ILogger>().object : logger;
    }

    public assertPrettyfiedAsExpected(fileNamePrefix: string): void {
        this.assertEditsPrettyfied(
            this.makeTextEdit(this.readFileContents(`${fileNamePrefix}-input.md`)),
            this.readFileContents(`${fileNamePrefix}-expected.md`)
        );
    }

    private assertEditsPrettyfied(edits: vscode.TextEdit[], expected: string): void {
        assert.equal(edits.length, 1);
        assert.equal(edits[0].newText, expected);
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
            new TableFactory(new AlignmentFactory()),
            new TableValidator(),
            new TableViewModelFactory(new RowViewModelFactory(new PadCalculator())),
            new TableStringWriter(),
            this._logger
        );
    }
}