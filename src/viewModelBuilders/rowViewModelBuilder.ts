import { RowViewModel } from "../viewModels/rowViewModel";
import { RowValue } from "./rowValue";

export class RowViewModelBuilder {
    public buildRow(rowValues: RowValue[]): RowViewModel {
        /*
            for each value, add a left padding and a right padding:
                * first row:
                    - has no left padding
                    - has no right padding if empty
                * last row:
                    - has no right padding
                    - has no left padding if empty
                * middle row:
                    - has left padding of 1 space
                    - has right padding of maxColLength + 1 space
                    - empty middle rows should have a length of 3 chars (spaces)
        */
        return null;
    }

    public buildSeparator(rowValues: RowValue[]): RowViewModel {
        return null;
    }
}