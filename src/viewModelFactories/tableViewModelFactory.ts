import { Table } from "../models/table";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModel } from "../viewModels/tableViewModel";
import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelFactory } from "./rowViewModelFactory";

export class TableViewModelFactory {

    constructor(
        private _rowViewModelFactory: RowViewModelFactory
    ) { }

    public build(tableWithoutSeparator: Table): TableViewModel {

        //TODO: consider passing the entire table to the rowVmb.BuildRow method with the row index. 
        // Then the RowViewModelFactoryParam class can be deleted.

        let result = new TableViewModel();
        result.hasLeftBorder = tableWithoutSeparator.hasLeftBorder;
        result.hasRightBorder = tableWithoutSeparator.hasRightBorder;
        result.header = this._rowViewModelFactory.buildRow(0, tableWithoutSeparator);
        result.separator = this._rowViewModelFactory.buildSeparator(tableWithoutSeparator);
        result.rows = this.buildRows(tableWithoutSeparator);

        return result;
    }

    private buildRows(table: Table): RowViewModel[] {
        let result: RowViewModel[] = new Array(table.rowCount - 1);

        for (let row = 1; row < table.rowCount; row++)
            result[row - 1] = this._rowViewModelFactory.buildRow(row, table);

        return result;
    }
}