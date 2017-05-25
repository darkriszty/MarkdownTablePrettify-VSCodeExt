import * as assert from 'assert';
import { TableValidator } from "../../src/modelFactory/tableValidator";

suite("TableValidator tests", () => {

    test("isValid() with null input with separator check returns false", () => {
        const rows = null;
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, false);
    });

    test("isValid() with null input without separator check returns false", () => {
        const tableText = null;
        const sut = createSut();

        const isValid: boolean = sut.isValid(tableText, false);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two rows with separator check returns false", () => {
        const rows = [ 
            [ "a", "b" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two rows without separator check returns false", () => {
        const rows = [ 
            [ "a", "b" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two columns with separator check returns false", () => {
        const rows = [ 
            [ "a" ],
            [ "b" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two columns without separator check returns false", () => {
        const rows = [ 
            [ "a" ],
            [ "b" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, false);
    });

    test("isValid() with two rows and two columns with separator check returns false", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "c", "d" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, false);
    });

    test("isValid() with two rows and two columns without separator check returns true", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "c", "d" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    test("isValid() with two rows and a separator and two columns with separator check returns true", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "-", "-" ],
            [ "c", "d" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, true);
    });

    test("isValid() with two rows and a separator and two columns without separator check returns true", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "-", "-" ],
            [ "c", "d" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    test("isValid() with invalid separator chars with separator check returns false", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "-x-", "--" ],
            [ "c", "d" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, false);
    });

    test("isValid() with invalid separator chars without separator check returns true", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "-x-", "--" ],
            [ "c", "d" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    test("isValid() with mismatching row counts with separator check returns false", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "-", "-" ],
            [ "c", "d", "e" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, false);
    });

    test("isValid() with mismatching row counts without separator check returns false", () => {
        const rows = [ 
            [ "a", "b" ],
            [ "-", "-", "-" ],
            [ "c", "d", "e" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, false);
    });

    test("isValid() with empty first columns with separator check returns true", () => {
        const rows = [ 
            [ "",   "  h1  ",   "  h2  ",   "  h3  " ],
            [ "",   " - "   ,   "--"    ,   "---"    ],
            [ "",   "c"     ,   "d"     ,   "e"      ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first columns without separator check returns true", () => {
        const rows = [ 
            [ "",   "  h1  ",   "  h2  ",   "  h3  " ],
            [ "",   "c"     ,   "d"     ,   "e"      ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    test("isValid() with empty last columns with separator check returns true", () => {
        const rows = [ 
            [ "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ " - "   ,   "--"    ,   "---"   , "" ],
            [ "c"     ,   "d"     ,   "e"     , "" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, true);
    });

    test("isValid() with empty last columns without separator check returns true", () => {
        const rows = [ 
            [ "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ "c"     ,   "d"     ,   "e"     , "" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first and last columns with separator check returns true", () => {
        const rows = [ 
            [ "",   "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ "",   " - "   ,   "--"    ,   "---"   , "" ],
            [ "",   "c"     ,   "d"     ,   "e"     , "" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first and last columns without separator check returns true", () => {
        const rows = [ 
            [ "",   "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ "",   "c"     ,   "d"     ,   "e"     , "" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first, middle and last columns with separator check returns true", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first, middle and last columns without separator check returns true", () => {
        const rows = [ 
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
         ];
        const sut = createSut();

        const isValid: boolean = sut.isValid(rows, false);

        assert.equal(isValid, true);
    });

    function createSut(): TableValidator {
        return new TableValidator();
    }
});