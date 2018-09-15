import { Table } from "../models/table";
import { AlignmentFactory } from "./alignmentFactory";
import { Alignment } from "../models/alignment";
import { Transformer } from "./transformers/transformer";
import { SelectionInterpreter } from "./selectionInterpreter";
import { Cell } from "../models/cell";

export class TableFactory {

    constructor(
        private _alignmentFactory: AlignmentFactory,
        private _selectionInterpreter: SelectionInterpreter,
        private _transformer: Transformer)
    { }

    public getModel(text: string): Table {
        if (text == null)
            throw new Error("Can't create table model from null table text.");

        const rowsWithoutSeparator = this._selectionInterpreter.allRows(text).filter((v, i) => i != 1);
        const separator = this._selectionInterpreter.separator(text);

        const alignments: Alignment[] = separator != null && separator.length > 0
            ? this._alignmentFactory.createAlignments(separator) 
            : [];

        const cells = rowsWithoutSeparator.map(row => row.map(c  => new Cell(c)));

        return this._transformer.process(new Table(cells, alignments));
    }
}