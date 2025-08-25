import { Transformer } from "./transformer";
import { Alignment } from "../../models/alignment";
import { Row } from "../../models/row";
import { Table } from "../../models/table";

export class BorderTransformer extends Transformer {
    
    public transform(input: Table): Table {
        if (input == null || input.isEmpty())
            return input;

        const hasLeftBorder: boolean = this.isColumnEmpty(input.rows, 0);
        const hasRightBorder: boolean = this.isColumnEmpty(input.rows, input.columnCount - 1);
        const rows: Row[] = this.rowsWithoutEmptyFirstAndLastColumn(input.rows, hasLeftBorder, hasRightBorder);
        const alignments = this.alignmentsWithoutEmptyFirstAndLastColumn(input.alignments, hasLeftBorder, hasRightBorder);

        // allow indentation if the table has a clear left border or if it was indented with tabs (possibly with additional spaces for alignment)
        const leftPad = hasLeftBorder || /^\t/.test(input.leftPad)
            ? input.leftPad
            : "";
        let result = new Table(rows, input.separatorEOL, alignments, leftPad);
        result.hasLeftBorder = hasLeftBorder;
        result.hasRightBorder = this.hasRightBorder(hasLeftBorder, hasRightBorder);
        return result;
    }

    private isColumnEmpty(rows: Row[], column: number): boolean {
        for (let row = 0; row < rows.length; row++) {
            const value = rows[row].cells[column];
            if (value != null && value.getValue().trim() != "")
                return false;
        }
        return true;
    }

    private rowsWithoutEmptyFirstAndLastColumn(rows: Row[], hasLeftBorder: boolean, hasRightBorder: boolean): Row[] {
        let newRows = rows;
        if (hasLeftBorder)
            this.removeColumn(newRows, 0);
        if (hasRightBorder)
            this.removeColumn(newRows, newRows[0].cells.length - 1);
        return newRows;
    }

    private removeColumn(rows: Row[], column: number): void {
        for (let row = 0; row < rows.length; row++)
            rows[row].cells.splice(column, 1);
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