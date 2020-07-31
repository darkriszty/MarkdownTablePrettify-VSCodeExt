import { MultiTablePrettyfier } from "../src/prettyfiers/multiTablePrettyfier";
import { TableFinder } from "../src/tableFinding/tableFinder";
import { TableValidator } from "../src/modelFactory/tableValidator";
import { SelectionInterpreter } from "../src/modelFactory/selectionInterpreter";
import { SingleTablePrettyfier } from "../src/prettyfiers/singleTablePrettyfier";
import { TableFactory } from "../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../src/modelFactory/alignmentFactory";
import { TrimmerTransformer } from "../src/modelFactory/transformers/trimmerTransformer";
import { BorderTransformer } from "../src/modelFactory/transformers/borderTransformer";
import { ConsoleLogger } from "../src/diagnostics/consoleLogger";
import { TableViewModelFactory } from "../src/viewModelFactories/tableViewModelFactory";
import { RowViewModelFactory } from "../src/viewModelFactories/rowViewModelFactory";
import { ContentPadCalculator } from "../src/padCalculation/contentPadCalculator";
import { PadCalculatorSelector } from "../src/padCalculation/padCalculatorSelector";
import { AlignmentMarkerStrategy } from "../src/viewModelFactories/alignmentMarking";
import { TableStringWriter } from "../src/writers/tableStringWriter";
import { SizeLimitChecker } from "../src/prettyfiers/sizeLimitCheker";

export class CliPrettify {

    public static prettify(text: string): string {
        const prettyfier = this.createPrettyfier();
        return prettyfier.formatTables(text);
    }

    private static createPrettyfier(): MultiTablePrettyfier {
        const logger = new ConsoleLogger();
        return new MultiTablePrettyfier(
            new TableFinder(new TableValidator(new SelectionInterpreter(true))),
            new SingleTablePrettyfier(
                new TableFactory(
                    new AlignmentFactory(),
                    new SelectionInterpreter(false),
                    new TrimmerTransformer(new BorderTransformer(null))
                ),
                new TableValidator(new SelectionInterpreter(false)),
                new TableViewModelFactory(new RowViewModelFactory(
                    new ContentPadCalculator(new PadCalculatorSelector(), " "), 
                    new AlignmentMarkerStrategy(":")
                )),
                new TableStringWriter(),
                [ logger ],
                new SizeLimitChecker([ logger ], 1000000) //TODO: extract an interface and implement and use an "NoSizeLimitChecker"
            ),
            new SizeLimitChecker([ logger ], 1000000)
        );
    }
}