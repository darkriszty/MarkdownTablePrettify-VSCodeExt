import { Transformer } from "./transformer";
import { Table } from "../../models/table";
import { Cell } from "../../models/cell";

export class TrimmerTransformer extends Transformer {
    
    public transform(input: Table): Table {
        return new Table(this.trimColumnValues(input.rows), input.alignments);
    }

    private trimColumnValues(rows: Cell[][]): Cell[][] {
        if (rows == null) return;
        let result: Cell[][] = [];
        for (let i = 0; i < rows.length; i++)
            result.push(rows[i].map(r => new Cell(r.getValue().trim())));
        return result;
    }
}