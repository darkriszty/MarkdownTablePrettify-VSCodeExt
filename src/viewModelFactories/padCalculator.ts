import { RowViewModelFactoryParam } from "./rowViewModelFactoryParam";
import { CellLengthCalculator } from "../cellLengthCalculator";

export class PadCalculator {

    public getLeftPadding(paddingChar: string, factoryParam: RowViewModelFactoryParam, column: number): string {
        let result;
        if (column == 0) {
            result = factoryParam.tableHasLeftBorder
                ? paddingChar
                : "";
        } else if (column == factoryParam.numberOfColumns - 1) {
            result = factoryParam.maxTextLengthsPerColumn[column] == 0
                ? ""
                : paddingChar;
        } else {
            result = paddingChar;
        }

        return result;
    }

    public getRightPadding(paddingChar: string, factoryParam: RowViewModelFactoryParam, column: number): string {
        if (column == factoryParam.numberOfColumns - 1 && !factoryParam.tableHasRightBorder)
            return "";
        return this.getRightPaddingInner(paddingChar, factoryParam, column);
    }

    public getRightPaddingForSeparator(paddingChar: string, factoryParam: RowViewModelFactoryParam, column: number): string {
        return this.getRightPaddingInner(paddingChar, factoryParam, column);
    }

    private getRightPaddingInner(paddingChar: string, factoryParam: RowViewModelFactoryParam, column: number): string {
        let result;
        const cellTextLength = CellLengthCalculator.getLength(factoryParam.rowValues[column]);
        if (column <= factoryParam.numberOfColumns - 1 || factoryParam.tableHasRightBorder) {
            let rightPadCount = factoryParam.maxTextLengthsPerColumn[column] > 0
                ? factoryParam.maxTextLengthsPerColumn[column] - cellTextLength
                : 1;
            if (factoryParam.maxTextLengthsPerColumn[column] > 0)
                rightPadCount++;
            result = paddingChar.repeat(rightPadCount);
        } else {
            result = paddingChar;
        }

        return result;
    }
}