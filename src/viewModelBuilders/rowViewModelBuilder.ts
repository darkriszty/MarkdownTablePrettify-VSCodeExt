import { RowViewModel } from "../viewModels/rowViewModel";
import { RowValue } from "./rowValue";

export class RowViewModelBuilder {
    public buildRow(rowValues: RowValue[]): RowViewModel {
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

    public buildSeparator(rowValues: RowValue[]): RowViewModel {
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
}

/* TODO: refactor: 
- this should get a ColumnConfiguration (array of numbers with MaxTextLengths per column) 
- the buildRows should get an array of strings
- the buildSeparator should not get any params
Then the RowValue should become obsolete.
*/