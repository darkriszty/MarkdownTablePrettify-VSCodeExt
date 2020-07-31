import { SizeLimitChecker } from "./sizeLimitCheker";
import { Document } from "../models/doc/document";
import { Range } from "../models/doc/range";
import { TableFinder } from "../tableFinding/tableFinder";
import { SingleTablePrettyfier } from "./singleTablePrettyfier";

export class MultiTablePrettyfier {
    constructor(
        private readonly _tableFinder: TableFinder,
        private readonly _singleTablePrettyfier: SingleTablePrettyfier,
        private readonly _sizeLimitChecker: SizeLimitChecker
    ) { }

    public formatTables(input: string): string
    {
        if (!this._sizeLimitChecker.isWithinAllowedSizeLimit(input)) {
            return input;
        }

        let document = new Document(input);
        let tableRange: Range = null;
        let tableSearchStartLine = 0;

        while ((tableRange = this._tableFinder.getNextRange(document, tableSearchStartLine)) != null) {
            const formattedTable: string = this._singleTablePrettyfier.prettifyTable(document, tableRange);
            document.replaceTextInRange(tableRange, formattedTable);
            tableSearchStartLine = tableRange.endLine + 1;
        }

        return document.getText();
    }
}
