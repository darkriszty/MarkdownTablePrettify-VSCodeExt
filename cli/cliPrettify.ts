import { CliOptions}  from "./cliOptions";
import { MultiTablePrettyfier } from "../src/prettyfiers/multiTablePrettyfier";
import { TableFinder } from "../src/tableFinding/tableFinder";
import { TableValidator } from "../src/modelFactory/tableValidator";
import { SelectionInterpreter } from "../src/modelFactory/selectionInterpreter";
import { TableFactory } from "../src/modelFactory/tableFactory";
import { AlignmentFactory } from "../src/modelFactory/alignmentFactory";
import { BorderTransformer } from "../src/modelFactory/transformers/borderTransformer";
import { TrimmerTransformer } from "../src/modelFactory/transformers/trimmerTransformer";
import { FairTableIndentationDetector } from "../src/modelFactory/tableIndentationDetector";
import { ConsoleLogger } from "../src/diagnostics/consoleLogger";
import { SingleTablePrettyfier } from "../src/prettyfiers/singleTablePrettyfier";
import { NoSizeLimitChecker } from "../src/prettyfiers/sizeLimit/noSizeLimitChecker";
import { TableViewModelFactory } from "../src/viewModelFactories/tableViewModelFactory";
import { RowViewModelFactory } from "../src/viewModelFactories/rowViewModelFactory";
import { ContentPadCalculator } from "../src/padCalculation/contentPadCalculator";
import { PadCalculatorSelector } from "../src/padCalculation/padCalculatorSelector";
import { AlignmentMarkerStrategy } from "../src/viewModelFactories/alignmentMarking";
import { TableStringWriter } from "../src/writers/tableStringWriter";
import { ValuePaddingProvider } from "../src/writers/valuePaddingProvider";

export class CliPrettify {

    public static prettify(text: string, options?: CliOptions): string {
        const prettyfier = this.createPrettyfier(options);
        return prettyfier.formatTables(text);
    }

    public static check(text: string, options?: CliOptions): void {
        if (this.prettify(text, options) !== text) {
            throw new Error("The input file is not prettyfied!");
        }
    }

    private static createPrettyfier(options?: CliOptions): MultiTablePrettyfier {
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
                new TableStringWriter(new ValuePaddingProvider(options?.columnPadding ?? 0)),
                [ logger ],
                new NoSizeLimitChecker()
            ),
            new NoSizeLimitChecker()
        );
    }
}