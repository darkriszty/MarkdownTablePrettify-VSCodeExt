import * as assert from 'assert';
import { ConsoleLogger } from '../../../src/diagnostics/consoleLogger';
import { MultiTablePrettyfier } from '../../../src/prettyfiers/multiTablePrettyfier';
import { TableFinder } from '../../../src/tableFinding/tableFinder';
import { TableValidator } from '../../../src/modelFactory/tableValidator';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';
import { SingleTablePrettyfier } from '../../../src/prettyfiers/singleTablePrettyfier';
import { TableFactory } from '../../../src/modelFactory/tableFactory';
import { AlignmentFactory } from '../../../src/modelFactory/alignmentFactory';
import { TrimmerTransformer } from '../../../src/modelFactory/transformers/trimmerTransformer';
import { BorderTransformer } from '../../../src/modelFactory/transformers/borderTransformer';
import { TableViewModelFactory } from '../../../src/viewModelFactories/tableViewModelFactory';
import { RowViewModelFactory } from '../../../src/viewModelFactories/rowViewModelFactory';
import { ContentPadCalculator } from '../../../src/padCalculation/contentPadCalculator';
import { PadCalculatorSelector } from '../../../src/padCalculation/padCalculatorSelector';
import { AlignmentMarkerStrategy } from '../../../src/viewModelFactories/alignmentMarking';
import { TableStringWriter } from '../../../src/writers/tableStringWriter';
import { SizeLimitChecker } from '../../../src/prettyfiers/sizeLimitCheker';

suite("MultiTablePrettyfier tests", () => {
//TODO: this should be tested with the same system tests
/*    test("formatTables() with a single line returns the input", () => {
        const text = "line1";
        const sut = createSut();

        const result = sut.formatTables(text);

        assert.equal(result, text);
    });

    test("formatTables() with multiple lines and extra EOL at the end of file returns the input", () => {
        const text = "line1\r\nline2\r\n";
        const sut = createSut();

        const result = sut.formatTables(text);

        assert.equal(result, text);
    });
*/
    test("formatTables() for table with alignments the formatted table and surrounding text is returned", () => {
        const text = `no table on first line\r\n| Primitive Type | Size(bit) | Wrapper |\r\n|-:|-|-|\r\n|short | 16| Short |\r\n| int | 32  | Integer |\r\n\r\nno table here\r\n`;
        const expected = `no table on first line\r\n| Primitive Type | Size(bit) | Wrapper |\r\n|---------------:|-----------|---------|\r\n|          short | 16        | Short   |\r\n|            int | 32        | Integer |\r\n\r\nno table here\r\n`;

        const sut = createSut();

        const result = sut.formatTables(text);

        assert.equal(result, expected);
    });

    function createSut() {
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
});