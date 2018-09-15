import { Table } from "../../models/table";
import { Cell } from "../../models/cell";
import { RightPadCalculator } from "./rightPadCalculator";

export class FirstColumnPadCalculator extends RightPadCalculator {
    protected extraPadCount(table: Table): number {
        return table.hasLeftBorder ? 1 : 0;
    }
}