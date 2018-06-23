import { Table } from "../../models/table";
import { CenterPadCalculator } from "./centerPadCalculator";

export class FirstColumnPadCalculator extends CenterPadCalculator {
    protected extraPadCount(table: Table): number {
        return table.hasLeftBorder ? 2 : 1;
    }
}