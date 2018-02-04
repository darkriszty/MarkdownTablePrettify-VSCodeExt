import { Table } from "../models/table";
import { BasePadCalculator } from "./basePadCalculator";
import { FirstColumnPadCalculator } from "./firstColumnPadCalculator";
import { LastColumnPadCalculator } from "./lastColumnPadCalculator";
import { MiddleColumnPadCalculator } from "./middleColumnPadCalculator";

export class ColumnBasedPadCalculatorSelector {
    public select(table: Table,  column: number) : BasePadCalculator {
        if (column == 0) return new FirstColumnPadCalculator();
        if (column == table.columnCount - 1) return new LastColumnPadCalculator();
        return new MiddleColumnPadCalculator();
    }
}