import { RowViewModelBuilderParam } from "./rowViewModelBuilderParam";
import { CellLengthCalculator } from "./cellLengthCalculator";

export class PadCalculator {

    public getLeftPadding(paddingChar: string, builderParam: RowViewModelBuilderParam, column: number): string {
        let result;
        if (column == 0) {
            result = builderParam.tableHasLeftBorder
                ? paddingChar
                : "";
        } else if (column == builderParam.numberOfColumns - 1) {
            result = builderParam.maxTextLengthsPerColumn[column] == 0
            ? ""
            : paddingChar;
        } else {
            result = paddingChar;
        }

        return result;
    }

    public getRightPadding(paddingChar: string, builderParam: RowViewModelBuilderParam, column: number): string {
        let result;
        const cellTextLength = CellLengthCalculator.getLength(builderParam.rowValues[column]);
        if (column < builderParam.numberOfColumns - 1 || builderParam.tableHasRightBorder) {
            const rightPadCount = builderParam.maxTextLengthsPerColumn[column] > 0
                ? builderParam.maxTextLengthsPerColumn[column] - cellTextLength
                : 1;
            result = paddingChar.repeat(rightPadCount + 1);
        } else {
            result = paddingChar;
        }

        return result;
    }
}