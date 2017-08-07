import { RowViewModel } from "./rowViewModel";

export class TableViewModel {
    public header: RowViewModel;
    public separator: RowViewModel;
    public rows: RowViewModel[] = [];
    public hasLeftBorder: boolean;
    public hasRightBorder: boolean;
}