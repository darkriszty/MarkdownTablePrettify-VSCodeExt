import { Table } from "../../models/table";
import { CenterPadCalculator } from "./centerPadCalculator";

export class MiddleColumnPadCalculator extends CenterPadCalculator {
    protected extraPadCount(table: Table): number {
        return 2;
    }
}