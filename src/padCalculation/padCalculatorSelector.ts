import { Table } from "../models/table";
import { BasePadCalculator } from "./basePadCalculator";
import * as LeftAlignment from "./left";
import * as RightAlignment from "./right";
import * as CenterAlignment from "./center";
import { Alignment } from "../models/alignment";

export class PadCalculatorSelector {
    public select(table: Table,  column: number) : BasePadCalculator {
        switch (table.alignments[column]) {
            case Alignment.Center: return this.centerAlignmentPadCalculator(table, column);
            case Alignment.Right: return this.rightAlignmentPadCalculator(table, column);
            default: return this.leftAlignmentPadCalculator(table, column);
        }
    }

    private leftAlignmentPadCalculator(table: Table,  column: number) : BasePadCalculator {
        if (column == 0) return new LeftAlignment.FirstColumnPadCalculator();
        if (column == table.columnCount - 1) return new LeftAlignment.LastColumnPadCalculator();
        return new LeftAlignment.MiddleColumnPadCalculator();
    }

    private centerAlignmentPadCalculator(table: Table,  column: number) : BasePadCalculator {
        if (column == 0) return new CenterAlignment.FirstColumnPadCalculator();
        if (column == table.columnCount - 1) return new CenterAlignment.LastColumnPadCalculator();
        return new CenterAlignment.MiddleColumnPadCalculator();
    }

    private rightAlignmentPadCalculator(table: Table,  column: number) : BasePadCalculator {
        if (column == 0) return new RightAlignment.FirstColumnPadCalculator();
        if (column == table.columnCount - 1) return new RightAlignment.LastColumnPadCalculator();
        return new RightAlignment.MiddleColumnPadCalculator();
    }
}