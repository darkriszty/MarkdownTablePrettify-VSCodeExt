import { TableViewModel } from "../viewModels/tableViewModel";
import { TableValidator } from "../modelFactory/tableValidator";

export class TableViewModelBuilder {

    constructor(
        private _tableValidator: TableValidator
    ) { }

    public build(valuesWithoutSeparator: string[][]): TableViewModel {
        if (!this._tableValidator.isValid(valuesWithoutSeparator, false))
            throw new Error("Invalid table values supplied.");
        /*
            1) validate without separator
            2) trim values
            3) create intermediary columns
            4) obtain max length for each column
            5) create Row VMB
            6) use first row to get header from rowViewModelBuilder.buildRow
            7) use dummy column to build separator from rowViewModelBuilder.buildSeparator
            8) use the rest of the rows to get the contents via rowViewModelBuilder.buildRow
            9) return the view model
        */
        return null;
    }
}