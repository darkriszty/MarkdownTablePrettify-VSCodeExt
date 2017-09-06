import { Table } from "../models/table";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModel } from "../viewModels/tableViewModel";
import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelBuilder } from "./rowViewModelBuilder";
import { RowViewModelBuilderParam } from "./rowViewModelBuilderParam";
import { CellLengthCalculator } from "./cellLengthCalculator";

export class TableViewModelBuilder {

    constructor(
        private _rowViewModelBuilder: RowViewModelBuilder
    ) { }

    public build(tableWithoutSeparator: Table): TableViewModel {
        /*
            1) validate without separator
            2) trim values
            3) create intermediary columns
            4) obtain max length for each column
            5) use first row to get header from rowViewModelBuilder.buildRow
            6) use dummy column to build separator from rowViewModelBuilder.buildSeparator
            7) use the rest of the rows to get the contents via rowViewModelBuilder.buildRow
            8) return the view model
        */
        const maxColLengths: number[] = CellLengthCalculator.getMaxLengths(tableWithoutSeparator);
        //TODO: consider passing the entire table to the rowVmb.BuildRow method with the row index. 
        // Then the RowViewModelBuilderParam class can be deleted.
        let result = new TableViewModel();
        result.hasLeftBorder = tableWithoutSeparator.hasLeftBorder;
        result.hasRightBorder = tableWithoutSeparator.hasRightBorder;
        result.header = this.buildHeader(tableWithoutSeparator, maxColLengths);
        result.separator = this.buildSeparator(tableWithoutSeparator, maxColLengths);
        result.rows = this.buildRows(tableWithoutSeparator, maxColLengths);

        return result;
    }

    private buildHeader(table: Table, maxColLengths: number[]): RowViewModel {
        let param = new RowViewModelBuilderParam(maxColLengths, table.hasLeftBorder, table.hasRightBorder);
        param.rowValues = table.rows[0];
        return this._rowViewModelBuilder.buildRow(param);
    }

    private buildSeparator(table: Table, maxColLengths: number[]): RowViewModel {
        let param = new RowViewModelBuilderParam(maxColLengths, table.hasLeftBorder, table.hasRightBorder);
        return this._rowViewModelBuilder.buildSeparator(param);
    }

    private buildRows(table: Table, maxColLengths: number[]): RowViewModel[] {
        let result: RowViewModel[] = new Array(table.rowCount - 1);

        for (let row = 1; row < table.rowCount; row++) {
            let param = new RowViewModelBuilderParam(maxColLengths, table.hasLeftBorder, table.hasRightBorder);
            param.rowValues = table.rows[row];
            result[row - 1] = this._rowViewModelBuilder.buildRow(param);
        }

        return result;
    }
}