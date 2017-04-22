import { Column } from "../column/column";
import { ColumnFactory } from "../column/columnFactory";
import { ColumnPositioning } from "../column/columnPositioning";

export interface ITable {
    prettyPrint(): string;
}

export class Table implements ITable {
    private _columns: Column[] = [];

    constructor(rowsWithoutSeparator: string[][]) {
        this._generateColumns(rowsWithoutSeparator);
    }

    private _generateColumns(rawRows: string[][]): void {
        for (let column of ColumnFactory.generateColumns(rawRows)) {
            this._columns.push(column);
        }
    }

    public prettyPrint(): string {
        const rowCount = this._columns[0].getSize();
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