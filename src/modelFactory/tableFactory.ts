import { Table } from "../models/table";
import { AlignmentFactory } from "./alignmentFactory";
import { Alignment } from "../models/alignment";
import { Transformer } from "./transformers/transformer";
import { SelectionInterpreter } from "./selectionInterpreter";

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

        const alignments: Alignment[] = rowsWithoutSeparator != null && rowsWithoutSeparator.length > 1 
            ? this._alignmentFactory.createAlignments(rowsWithoutSeparator[1]) 
            : [];

        return this._transformer.process(new Table(rowsWithoutSeparator, alignments));
    }
}