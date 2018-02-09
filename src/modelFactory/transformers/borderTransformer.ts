import { Transformer } from "./transformer";
import { Table } from "../../models/table";
import { Alignment } from "../../models/alignment";
import { Cell } from "../../models/cell";

export class BorderTransformer extends Transformer {
    
    public transform(input: Table): Table {
        if (input == null || input.isEmpty())
            return input;

        const hasLeftBorder: boolean = this.isColumnEmpty(input.rows, 0);
        const hasRightBorder: boolean = this.isColumnEmpty(input.rows, input.columnCount - 1);
        const rows = this.rowsWithoutEmptyFirstAndLastColumn(input.rows, hasLeftBorder, hasRightBorder);
        const alignments = this.alignmentsWithoutEmptyFirstAndLastColumn(input.alignments, hasLeftBorder, hasRightBorder);

        let result = new Table(rows, alignments);
        result.hasLeftBorder = hasLeftBorder;
        result.hasRightBorder = this.hasRightBorder(hasLeftBorder, hasRightBorder);
        return result;
    }

    private isColumnEmpty(rows: Cell[][], column: number): boolean {
        for (let row = 0; row < rows.length; row++) {
            const value = rows[row][column];
            if (value != null && value.getValue().trim() != "")
                return false;
        }
        return true;
    }

    private rowsWithoutEmptyFirstAndLastColumn(rows: Cell[][], hasLeftBorder: boolean, hasRightBorder: boolean): Cell[][] {
        let newRows = rows;
        if (hasLeftBorder)
            this.removeColumn(newRows, 0);
        if (hasRightBorder)
            this.removeColumn(newRows, newRows[0].length - 1);
        return newRows;
    }

    private removeColumn(rows: Cell[][], column: number): void {
        for (let row = 0; row < rows.length; row++)
            rows[row].splice(column, 1);
    }

    private alignmentsWithoutEmptyFirstAndLastColumn(alignments: Alignment[], hasLeftBorder: boolean, hasRightBorder: boolean): Alignment[] {
        let newAlignments = alignments;
        if (hasLeftBorder)
            newAlignments.shift();
        if (hasRightBorder)
            newAlignments.pop();
        return newAlignments;
    }

    private hasRightBorder(hadLeftBorder: boolean, hadRightBorder: boolean): boolean {
        let result = hadRightBorder;

        if (hadLeftBorder && !hadRightBorder)
            result = true;
        if (!hadLeftBorder && hadRightBorder)
            result = false;

        return result;
    }
}