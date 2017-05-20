import { TableValidator } from "./tableValidator";

export class TableFactory {

    constructor(
        private _validator: TableValidator)
    { }

    public getModel(text: string): string[][] {
        /*
            1) validate
            2) remove separator
            3) return matrix
        */
        return null;
    }
}