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

        let result = new TableViewModel();
        result.hasLeftBorder = tableWithoutSeparator.hasLeftBorder;
        result.hasRightBorder = tableWithoutSeparator.hasRightBorder;
        result.header = this._rowViewModelFactory.buildRow(0, tableWithoutSeparator);
        result.rows = this.buildRows(tableWithoutSeparator);
        result.separator = this.buildSeparator(result, tableWithoutSeparator);

        return result;
    }

    private buildRows(table: Table): RowViewModel[] {
        let result: RowViewModel[] = new Array(table.rowCount - 1);

        for (let row = 1; row < table.rowCount; row++)
            result[row - 1] = this._rowViewModelFactory.buildRow(row, table);

        return result;
    }

    private buildSeparator(tableVm: TableViewModel, table: Table) {
        let rowsForSeparatorCalculation: RowViewModel[] = new Array();
        
        rowsForSeparatorCalculation.push(tableVm.header);
        for (let r of tableVm.rows) {
            rowsForSeparatorCalculation.push(r);
        }

        return this._rowViewModelFactory.buildSeparator(rowsForSeparatorCalculation, table);
    }
}