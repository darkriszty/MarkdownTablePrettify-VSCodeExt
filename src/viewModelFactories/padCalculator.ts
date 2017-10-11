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
        let result;
        const cellTextLength = CellLengthCalculator.getLength(factoryParam.rowValues[column]);
        if (column < factoryParam.numberOfColumns - 1 || factoryParam.tableHasRightBorder) {
            const rightPadCount = factoryParam.maxTextLengthsPerColumn[column] > 0
                ? factoryParam.maxTextLengthsPerColumn[column] - cellTextLength
                : 1;
            result = paddingChar.repeat(rightPadCount + 1);
        } else if (column == factoryParam.numberOfColumns - 1 && !factoryParam.tableHasRightBorder) {
            return "";
        } else {
            result = paddingChar;
        }

        return result;
    }
}