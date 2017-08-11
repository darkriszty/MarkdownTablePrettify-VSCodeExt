import { RowViewModel } from "./rowViewModel";

export class TableViewModel {
    public get columnCount(): number { return this.header.columnCount; }
    public get rowCount(): number { return this.rows.length; }

    public header: RowViewModel;
    public separator: RowViewModel;
    public rows: RowViewModel[] = [];
    public hasLeftBorder: boolean;
    public hasRightBorder: boolean;
}