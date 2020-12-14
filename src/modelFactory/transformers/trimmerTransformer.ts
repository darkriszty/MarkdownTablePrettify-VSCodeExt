import { Transformer } from "./transformer";
import { Cell } from "../../models/cell";
import { Row } from "../../models/row";
import { Table } from "../../models/table";

export class TrimmerTransformer extends Transformer {
    
    public transform(input: Table): Table {
        return new Table(this.trimColumnValues(input.rows), input.separatorEOL, input.alignments, input.leftPad);
    }

    private trimColumnValues(rows: Row[]): Row[] {
        let result: Row[] = [];

        if (rows == null) 
            return result;

        for (let i = 0; i < rows.length; i++)
            result.push(new Row(rows[i].cells.map(cell => new Cell(cell.getValue().trim())), rows[i].EOL));

        return result;
    }
}