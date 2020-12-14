import { Table } from "../models/table";
import { AlignmentFactory } from "./alignmentFactory";
import { Alignment } from "../models/alignment";
import { Transformer } from "./transformers/transformer";
import { SelectionInterpreter } from "./selectionInterpreter";
import { TableIndentationDetector } from "./tableIndentationDetector";
import { Cell } from "../models/cell";
import { Line } from "../models/doc/line";
import { Row } from "../models/row";
import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";

export class TableFactory {

    constructor(
        private _alignmentFactory: AlignmentFactory,
        private _selectionInterpreter: SelectionInterpreter,
        private _transformer: Transformer,
        private _tableIndentationDetector: TableIndentationDetector)
    { }

    public getModel(document: Document, range: Range): Table {
        const lines: Line[] = document.getLines(range);
        if (lines == null || lines.length == 0)
            throw new Error("Can't create table model from no lines.");

        const rowsWithoutSeparator: Row[] = lines
            .filter((_, i) => i != 1)
            .map(line => new Row(
                this._selectionInterpreter
                    .splitLine(line.value)
                    .map(c => new Cell(c)),
                line.EOL)
            );

        const separatorLine: Line = lines[1];
        const separator: string[] = this._selectionInterpreter.splitLine(separatorLine.value);

        const alignments: Alignment[] = separator != null && separator.length > 0
            ? this._alignmentFactory.createAlignments(separator) 
            : [];

        const leftPad: string = this._tableIndentationDetector.getLeftPad(lines.map(l => l.value));

        return this._transformer.process(new Table(rowsWithoutSeparator, separatorLine.EOL, alignments, leftPad));
    }
}