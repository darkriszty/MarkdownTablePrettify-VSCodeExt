import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelBuilderParam } from "./rowViewModelBuilderParam";

export class RowViewModelBuilder {

    public buildRow(param: RowViewModelBuilderParam): RowViewModel {
        if (param == null)
            throw new Error("Paramter can't be null");
        if (param.rowValues == null)
            throw new Error("Rows can't be null");
        /*
            for each value, add a left padding and a right padding:
                * first column:
                    - has no left padding
                    - has no right padding if empty
                * last column:
                    - has no right padding
                    - has no left padding if empty
                * middle column:
                    - has left padding of 1 space
                    - has right padding of maxColLength + 1 space
                    - empty middle rows should have a length of 3 chars (spaces)
        */

        let resultRow = new Array(param.numberOfColumns);
        for (let i = 0; i < param.numberOfColumns; i++) {
            const columnLength = param.maxTextLengthsPerColumn[i];
            resultRow[i] = param.rowValues[i];
        }

        return new RowViewModel(resultRow);
    }

    public buildSeparator(param: RowViewModelBuilderParam): RowViewModel {
        if (param == null)
            throw new Error("Paramter can't be null");

        let resultRow = new Array(param.numberOfColumns);
        for (let i = 0; i < param.numberOfColumns; i++) {
            const columnLength = param.maxTextLengthsPerColumn[i];
            resultRow[i] = new Array(columnLength).fill("-").join("");
        }

        return new RowViewModel(resultRow);
    }
}
