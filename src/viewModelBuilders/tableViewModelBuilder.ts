import { TableViewModel } from "../viewModels/tableViewModel";

export class TableViewModelBuilder {
    public build(tableValues: string[][]): TableViewModel {
        /*
            1) validate
            2) split rows&trim
            3) create intermediary columns
            4) obtain max length for each column
            5) create RowValue from intermediary columns for each row
            6) use first row to get header from rowViewModelBuilder.buildRow
            7) use dummy column to build separator from rowViewModelBuilder.buildSeparator
            8) use the rest of the rows to get the contents via rowViewModelBuilder.buildRow
            9) return the view model
        */
        return null;
    }
}