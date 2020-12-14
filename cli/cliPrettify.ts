import { MultiTablePrettyfier } from "../src/prettyfiers/multiTablePrettyfier";
import { TableFinder } from "../src/tableFinding/tableFinder";
import { TableValidator } from "../src/modelFactory/tableValidator";
import { SelectionInterpreter } from "../src/modelFactory/selectionInterpreter";
import { TableFactory } from "../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../src/modelFactory/alignmentFactory";
import { TrimmerTransformer } from "../src/modelFactory/transformers/trimmerTransformer";
import { BorderTransformer } from "../src/modelFactory/transformers/borderTransformer";
import { ConsoleLogger } from "../src/diagnostics/consoleLogger";
import { SingleTablePrettyfier } from "../src/prettyfiers/singleTablePrettyfier";
import { NoSizeLimitChecker } from "../src/prettyfiers/sizeLimit/noSizeLimitChecker";
import { TableViewModelFactory } from "../src/viewModelFactories/tableViewModelFactory";
import { RowViewModelFactory } from "../src/viewModelFactories/rowViewModelFactory";
import { ContentPadCalculator } from "../src/padCalculation/contentPadCalculator";
import { PadCalculatorSelector } from "../src/padCalculation/padCalculatorSelector";
import { AlignmentMarkerStrategy } from "../src/viewModelFactories/alignmentMarking";
import { TableStringWriter } from "../src/writers/tableStringWriter";
import { FairTableIndentationDetector } from "../src/modelFactory/tableIndentationDetector";

export class CliPrettify {

    public static prettify(text: string): string {
        const prettyfier = this.createPrettyfier();
        return prettyfier.formatTables(text);
    }

    public static check(text: string): void {
        if (this.prettify(text) !== text) {
            throw new Error("The input file is not prettyfied!");
        }
    }

    private static createPrettyfier(): MultiTablePrettyfier {
        const logger = new ConsoleLogger();
        return new MultiTablePrettyfier(
            new TableFinder(new TableValidator(new SelectionInterpreter(true))),
            new SingleTablePrettyfier(
                new TableFactory(
                    new AlignmentFactory(),
                    new SelectionInterpreter(false),
                    new TrimmerTransformer(new BorderTransformer(null)),
                    new FairTableIndentationDetector()
                ),
                new TableValidator(new SelectionInterpreter(false)),
                new TableViewModelFactory(new RowViewModelFactory(
                    new ContentPadCalculator(new PadCalculatorSelector(), " "), 
                    new AlignmentMarkerStrategy(":")
                )),
                new TableStringWriter(),
                [ logger ],
                new NoSizeLimitChecker()
            ),
            new NoSizeLimitChecker()
        );
    }
}