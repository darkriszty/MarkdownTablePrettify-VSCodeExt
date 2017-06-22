import { RowViewModel } from "../viewModels/rowViewModel";

export class RowViewModelBuilder {
    private _maxTextLengthsPerColumn: number[];

    public setMaxTextLengthsPerColumn(maxTextLengthsPerColumn: number[]): void {
        this._maxTextLengthsPerColumn = maxTextLengthsPerColumn;
    }

    public buildRow(rowValues: string[]): RowViewModel {
        if (this._maxTextLengthsPerColumn == null)
            throw new Error("Can't build row without knowing the expected lengths.");
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

    public buildSeparator(): RowViewModel {
        if (this._maxTextLengthsPerColumn == null)
            throw new Error("Can't build separator without knowing the expected lengths.");
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
