import { Table } from "../models/table";
import { BasePadCalculator } from "./basePadCalculator";
import { FirstColumnPadCalculator } from "./left/firstColumnPadCalculator";
import { LastColumnPadCalculator } from "./left/lastColumnPadCalculator";
import { MiddleColumnPadCalculator } from "./left/middleColumnPadCalculator";

export class PadCalculatorSelector {
    public select(table: Table,  column: number) : BasePadCalculator {
        if (column == 0) return new FirstColumnPadCalculator();
        if (column == table.columnCount - 1) return new LastColumnPadCalculator();
        return new MiddleColumnPadCalculator();
    }
}