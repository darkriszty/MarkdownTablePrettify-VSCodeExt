import { Table } from "../models/table";
import { BasePadCalculator } from "./basePadCalculator";
import * as LeftAlignment from "./left";
import * as RightAlignment from "./right";
import * as CenterAlignment from "./center";
import { Alignment } from "../models/alignment";

export class PadCalculatorSelector {
    private static readonly leftFirstColumn = new LeftAlignment.FirstColumnPadCalculator();
    private static readonly leftMiddleColumn = new LeftAlignment.MiddleColumnPadCalculator();
    private static readonly leftLastColumn = new LeftAlignment.LastColumnPadCalculator();

    private static readonly centerFirstColumn = new CenterAlignment.FirstColumnPadCalculator();
    private static readonly centerMiddleColumn = new CenterAlignment.MiddleColumnPadCalculator();
    private static readonly centerLastColumn = new CenterAlignment.LastColumnPadCalculator();

    private static readonly rightFirstColumn = new RightAlignment.FirstColumnPadCalculator();
    private static readonly rightMiddleColumn = new RightAlignment.MiddleColumnPadCalculator();
    private static readonly rightLastColumn = new RightAlignment.LastColumnPadCalculator();

    public select(table: Table, column: number) : BasePadCalculator {
        switch (table.alignments[column]) {
            case Alignment.Center: return this.centerAlignmentPadCalculator(table, column);
            case Alignment.Right: return this.rightAlignmentPadCalculator(table, column);
            default: return this.leftAlignmentPadCalculator(table, column);
        }
    }

    private leftAlignmentPadCalculator(table: Table, column: number) : BasePadCalculator {
        if (column == 0) return PadCalculatorSelector.leftFirstColumn;
        if (column == table.columnCount - 1) return PadCalculatorSelector.leftLastColumn;
        return PadCalculatorSelector.leftMiddleColumn;
    }

    private centerAlignmentPadCalculator(table: Table, column: number) : BasePadCalculator {
        if (column == 0) return PadCalculatorSelector.centerFirstColumn;
        if (column == table.columnCount - 1) return PadCalculatorSelector.centerLastColumn;
        return PadCalculatorSelector.centerMiddleColumn;
    }

    private rightAlignmentPadCalculator(table: Table, column: number) : BasePadCalculator {
        if (column == 0) return PadCalculatorSelector.rightFirstColumn;
        if (column == table.columnCount - 1) return PadCalculatorSelector.rightLastColumn;
        return PadCalculatorSelector.rightMiddleColumn;
    }
}