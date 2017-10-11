import { Table } from "../models/table";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModel } from "../viewModels/tableViewModel";
import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelFactory } from "./rowViewModelFactory";
import { RowViewModelFactoryParam } from "./rowViewModelFactoryParam";

export class TableViewModelFactory {

    constructor(
        private _rowViewModelFactory: RowViewModelFactory
    ) { }

    public build(tableWithoutSeparator: Table): TableViewModel {
        /*
            1) validate without separator
            2) trim values
            3) create intermediary columns
            4) obtain max length for each column
            5) use first row to get header from rowViewModelFactory.buildRow
            6) use dummy column to build separator from rowViewModelFactory.buildSeparator
            7) use the rest of the rows to get the contents via rowViewModelFactory.buildRow
            8) return the view model
        */
        const maxColLengths: number[] = tableWithoutSeparator.getLongestColumnLength();
        //TODO: consider passing the entire table to the rowVmb.BuildRow method with the row index. 
        // Then the RowViewModelFactoryParam class can be deleted.
        let result = new TableViewModel();
        result.hasLeftBorder = tableWithoutSeparator.hasLeftBorder;
        result.hasRightBorder = tableWithoutSeparator.hasRightBorder;
        result.header = this.buildHeader(tableWithoutSeparator, maxColLengths);
        result.separator = this.buildSeparator(tableWithoutSeparator, maxColLengths);
        result.rows = this.buildRows(tableWithoutSeparator, maxColLengths);

        return result;
    }

    private buildHeader(table: Table, maxColLengths: number[]): RowViewModel {
        let param = new RowViewModelFactoryParam(maxColLengths, table.hasLeftBorder, table.hasRightBorder);
        param.rowValues = table.rows[0];
        return this._rowViewModelFactory.buildRow(param);
    }

    private buildSeparator(table: Table, maxColLengths: number[]): RowViewModel {
        let param = new RowViewModelFactoryParam(maxColLengths, table.hasLeftBorder, table.hasRightBorder);
        return this._rowViewModelFactory.buildSeparator(param);
    }

    private buildRows(table: Table, maxColLengths: number[]): RowViewModel[] {
        let result: RowViewModel[] = new Array(table.rowCount - 1);

        for (let row = 1; row < table.rowCount; row++) {
            let param = new RowViewModelFactoryParam(maxColLengths, table.hasLeftBorder, table.hasRightBorder);
            param.rowValues = table.rows[row];
            result[row - 1] = this._rowViewModelFactory.buildRow(param);
        }

        return result;
    }
}