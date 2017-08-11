import { Table } from "../models/table";
import { TableValidator } from "../modelFactory/tableValidator";
import { TableViewModel } from "../viewModels/tableViewModel";
import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelBuilder } from "./rowViewModelBuilder";
import { RowViewModelBuilderParam } from "./rowViewModelBuilderParam";

export class TableViewModelBuilder {

    constructor(
        private _tableValidator: TableValidator,
        private _rowViewModelBuilder: RowViewModelBuilder
    ) { }

    public build(tableWithoutSeparator: Table): TableViewModel {
        if (!this._tableValidator.isValid(tableWithoutSeparator, false))
            throw new Error("Invalid table values supplied.");
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
        const maxColLengths: number[] = this.getMaxLengths(tableWithoutSeparator);

        let result = new TableViewModel();
        result.header = this.buildHeader(tableWithoutSeparator, maxColLengths);
        result.separator = this.buildSeparator(maxColLengths);
        result.rows = this.buildRows(tableWithoutSeparator, maxColLengths);

        return result;
    }

    private buildHeader(tableWithoutSeparator: Table, maxColLengths: number[]): RowViewModel {
        let param = new RowViewModelBuilderParam(maxColLengths);
        param.rowValues = tableWithoutSeparator.rows[0];
        return this._rowViewModelBuilder.buildRow(param);
    }

    private buildSeparator(maxColLengths: number[]): RowViewModel {
        let param = new RowViewModelBuilderParam(maxColLengths);
        return this._rowViewModelBuilder.buildSeparator(param);
    }

    private buildRows(table: Table, maxColLengths: number[]): RowViewModel[] {
        let result: RowViewModel[] = new Array(table.rowCount - 1);

        for (let row = 1; row < table.rowCount; row++) {
            let param = new RowViewModelBuilderParam(maxColLengths);
            param.rowValues = table.rows[row];
            result[row - 1] = this._rowViewModelBuilder.buildRow(param);
        }

        return result;
    }

    private getMaxLengths(table: Table): number[] {
        let maxColLengths: number[] = new Array(table.columnCount).fill(0);

        for (let col = 0; col < table.rows.length; col++)
            for (let row = 0; row < table.rows[col].length; row++)
                maxColLengths[col] = Math.max(table.rows[col][row].length, maxColLengths[col])

        return maxColLengths;
    }
}