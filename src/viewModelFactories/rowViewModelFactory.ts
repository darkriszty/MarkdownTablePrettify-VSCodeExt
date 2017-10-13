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
        return this.makeRow(param, " ", 
            this._padCalculator.getRightPadding.bind(this._padCalculator));
    }

    public buildSeparator(param: RowViewModelFactoryParam): RowViewModel {
        let paramForSeparator = RowViewModelFactoryParam.createFrom(param)
        paramForSeparator.rowValues = new Array(param.numberOfColumns).fill("-");
        return this.makeRow(paramForSeparator, "-", 
            this._padCalculator.getRightPaddingForSeparator.bind(this._padCalculator));
    }

    private makeRow(param: RowViewModelFactoryParam, 
        padChar: string,
        rightPadFunc: (string, RowViewModelFactoryParam, number) => string) 
    {
        let resultRow = new Array(param.numberOfColumns);
        for(let i = 0; i< param.numberOfColumns; i++) {
            const columnLength = param.maxTextLengthsPerColumn[i];
            const text = param.rowValues[i] == ""
                ? padChar
                : param.rowValues[i];
            resultRow[i] =
                this._padCalculator.getLeftPadding(padChar, param, i) +
                text +
                rightPadFunc(padChar, param, i);
        }
        return new RowViewModel(resultRow);
    }
}
