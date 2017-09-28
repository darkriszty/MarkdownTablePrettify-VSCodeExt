import { RowViewModel } from "../viewModels/rowViewModel";
import { RowViewModelFactoryParam } from "./rowViewModelFactoryParam";
import { PadCalculator } from "./padCalculator";

export class RowViewModelFactory {
    constructor(
        private _padCalculator: PadCalculator)
    { }

    public buildRow(param: RowViewModelFactoryParam): RowViewModel {
        if (param == null) throw new Error("Paramter can't be null");
        if (param.rowValues == null) throw new Error("Rows can't be null");
        return this.makeRow(param, " ");
    }

    public buildSeparator(param: RowViewModelFactoryParam): RowViewModel {
        let paramForSeparator = RowViewModelFactoryParam.createFrom(param)
        paramForSeparator.rowValues = new Array(param.numberOfColumns).fill("-");
        return this.makeRow(paramForSeparator, "-");
    }

    private makeRow(param: RowViewModelFactoryParam, padChar: string) {
        let resultRow = new Array(param.numberOfColumns);
        for(let i = 0; i< param.numberOfColumns; i++) {
            const columnLength = param.maxTextLengthsPerColumn[i];
            const text = param.rowValues[i] == ""
                ? padChar
                : param.rowValues[i];
            resultRow[i] =
                this._padCalculator.getLeftPadding(padChar, param, i) +
                text +
                this._padCalculator.getRightPadding(padChar, param, i);
        }
        return new RowViewModel(resultRow);
    }
}
