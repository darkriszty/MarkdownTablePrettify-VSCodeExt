import * as assert from 'assert';
import { Table } from "../../../src/models/table";
import { Alignment } from "../../../src/models/alignment";
import { BorderTransformer } from '../../../src/modelFactory/transformers/borderTransformer';

suite("BorderTransformer tests", () => {
    test("process() sets hasLeftBorder to true for empty first column", () => {
        const rows = [ 
            [ "", "  h1  ",   " " ,   "  h3  " ],
            [ "", "c"     ,   "  ",   "e"      ]
        ];
        const table = createSut().process(new Table(rows, getAlignmentsFor(rows)));

        assert.equal(table.hasLeftBorder, true);
    });

    test("process() sets hasLeftBorder to false for non-empty first column", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  " ],
            [ "c"     ,   "  ",   "e"      ]
        ];
        const table = createSut().process(new Table(rows, getAlignmentsFor(rows)));

        assert.equal(table.hasLeftBorder, false);
    });

    test("process() sets hasRightBorder to true when there is a left border and a right border", () => {
        const rows = [ 
            [ "", "  h1  ",   " " ,   "  h3  ", "" ],
            [ "", "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = createSut().process(new Table(rows, getAlignmentsFor(rows)));

        assert.equal(table.hasRightBorder, true);
    });

    test("process() sets hasRightBorder to true when there is a left border and no right border", () => {
        const rows = [ 
            [ "", "  h1  ",   " " ,   "  h3  " ],
            [ "", "c"     ,   "  ",   "e"      ]
        ];
        const table = createSut().process(new Table(rows, getAlignmentsFor(rows)));

        assert.equal(table.hasRightBorder, true);
    });

    test("process() sets hasRightBorder to false if there is a right border without a left border", () => {
        const rows = [ 
            [ "  h1  ",   " " ,   "  h3  ", "" ],
            [ "c"     ,   "  ",   "e"     , "" ]
        ];
        const table = createSut().process(new Table(rows, getAlignmentsFor(rows)));

        assert.equal(table.hasRightBorder, false);
    });

    function createSut() {
        return new BorderTransformer(null);
    }

    function getAlignmentsFor(rows: string[][], alignment: Alignment = Alignment.Left): Alignment[] {
        return rows[0].map(col => alignment);
    }
});