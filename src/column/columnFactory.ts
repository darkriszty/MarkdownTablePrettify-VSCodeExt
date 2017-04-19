import { Column } from "./column";
import { RawColumn } from "./rawColumn";
import { ColumnPositioning } from "./columnPositioning";

export class ColumnFactory {
    public static *generateColumns(rawRows: string[][]): Iterable<Column> {
        const rowCount = rawRows.length;
        let colCount = rawRows[0].length;

        let rawColumns: RawColumn[] = [];

        // Create "raw" columns first to be able to specify the position (first/middle/last) of all columns later (based 
        // on maxLength) taking into account that columns can still be added or removed from the begginning/end.
        for (let col = 0; col < colCount; col++) {
            rawColumns.push(new RawColumn(rawRows.map(r => r[col].trim())));
        }

        if (colCount > 1 && !rawColumns[0].isEmpty() && rawColumns[colCount - 1].isEmpty()) {
            // if the first column is not empty, but the last one is, then remove the last one
            rawColumns.splice(colCount - 1, 1);
            colCount--;
        } else if (colCount > 1 && rawColumns[0].isEmpty() && !rawColumns[colCount - 1].isEmpty()) {
            // add an empty column at the end if the first one is an empty column but the last one isn't
            const emptyRawRows = new Array(rowCount).fill(0);
            rawColumns.push(new RawColumn(emptyRawRows));
            colCount++;
        }

        // now that the types can be determined create the real columns
        for (let col = 0; col < colCount; col++) {
            const columnPositioning = col == 0
                ? ColumnPositioning.First
                : col == colCount - 1
                    ? ColumnPositioning.Last
                    : ColumnPositioning.Middle;
            yield new Column(rawColumns[col], columnPositioning);
        }
    }
}
