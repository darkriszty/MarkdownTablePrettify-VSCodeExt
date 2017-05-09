import { Column } from "./column";
import { ColumnFactory } from "./columnFactory";
import { ColumnPositioning } from "./columnPositioning";

export interface ITable {
    prettyPrint(): string;
}

export class Table implements ITable {
    constructor(private _columns: Column[]) { }

    public prettyPrint(): string {
        const rowCount = this._columns[0].getNumberOfRows();
        const colCount = this._columns.length;

        let buffer = "";
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < colCount; col++) {
                const column = this._columns[col];
                buffer += column.getValue(row);
                if (column.getPositioning() != ColumnPositioning.Last)
                    buffer += "|";
            }
            if (row < rowCount - 1)
                buffer += "\r";
        }

        return buffer;
    }
}