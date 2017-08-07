import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelBuilderParam } from "./rowViewModelBuilderParam";

export class RowViewModelBuilder {

    public buildRow(param: RowViewModelBuilderParam): RowViewModel {
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
        return null;
    }

    public buildSeparator(param: RowViewModelBuilderParam): RowViewModel {
        if (param == null)
            throw new Error("Paramter can't be null");
        let resultArray = new Array(param.maxTextLengthsPerColumn);

        /*
            for each value, add a left padding and a right padding:
                * first column:
                    - has no left padding
                    - has no left or right padding if empty
                    - has right padding of 1 dash otherwise
                * last column:
                    - has right padding with 1 extra dash
                    - has left padding of 1 dash
                    - has no left or right padding if empty
                * middle column:
                    - has left padding of 1 dash
                    - has right padding of maxColLength + 1 dash
                    - empty middle rows should have a length of 3 chars (dashes)
        */
        return null;
    }

    private getLeftPadding(paddingChar: string, builderParam: RowViewModelBuilderParam,
        column: number): string {

        let result;
        if (column == 0) {
            result = builderParam.tableHasLeftBorder
                ? paddingChar
                : "";
        } else if (column == builderParam.numberOfColumns() - 1) {

        } else {

        }

        return result;
    }
}
