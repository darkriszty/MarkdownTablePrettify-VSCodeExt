import { Transformer } from "./transformer";
import { Table } from "../../models/table";

export class TrimmerTransformer extends Transformer {
    
    public transform(input: Table): Table {
        return new Table(this.trimColumnValues(input.rows), input.alignments);
    }

    private trimColumnValues(rows: string[][]): string[][] {
        if (rows == null) return;
        let result: string[][] = [];
        for (let i = 0; i < rows.length; i++)
            result.push(rows[i].map(r => r.trim()));
        return result;
    }
}