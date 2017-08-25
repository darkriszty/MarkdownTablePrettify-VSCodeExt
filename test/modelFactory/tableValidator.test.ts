import * as assert from 'assert';
import { Table } from "../../src/models/table";
import { TableValidator } from "../../src/modelFactory/tableValidator";
import { Alignment } from "../../src/models/alignment";

suite("TableValidator tests", () => {

    test("isValid() with null input with separator check returns false", () => {
        const table = null;
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, false);
    });

    test("isValid() with null input without separator check returns false", () => {
        const tableText = null;
        const sut = createSut();

        const isValid: boolean = sut.isValid(tableText, false);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two rows with separator check returns false", () => {
        const table = new Table(
            [ [ "a", "b" ] ],
            [ Alignment.Left, Alignment.Left ]
        );
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two rows without separator check returns false", () => {
        const table = new Table(
            [ [ "a", "b" ] ],
            [ Alignment.Left, Alignment.Left ]
        );
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two columns with separator check returns false", () => {
        const table = new Table([
            [ "a" ],
            [ "b" ]
        ], [ Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two columns without separator check returns false", () => {
        const table = new Table([
            [ "a" ],
            [ "b" ]
        ], [ Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, false);
    });

    test("isValid() with two rows and two columns with separator check returns false", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "c", "d" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, false);
    });

    test("isValid() with two rows and two columns without separator check returns true", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "c", "d" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    test("isValid() with two rows and a separator and two columns with separator check returns true", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "-", "-" ],
            [ "c", "d" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, true);
    });

    test("isValid() with separator alignment options returns true", () => {
        const table = new Table([
            [ "a", "b", "c"],
            [ "-:", ":-:", ":-" ],
            [ "1", "2", "3" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, true);
    });

    test("isValid() with two rows and a separator and two columns without separator check returns true", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "-", "-" ],
            [ "c", "d" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    test("isValid() with invalid separator chars with separator check returns false", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "-x-", "--" ],
            [ "c", "d" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, false);
    });

    test("isValid() with invalid separator chars without separator check returns true", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "-x-", "--" ],
            [ "c", "d" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    test("isValid() with mismatching row counts with separator check returns false", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "-", "-" ],
            [ "c", "d", "e" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, false);
    });

    test("isValid() with mismatching row counts without separator check returns false", () => {
        const table = new Table([
            [ "a", "b" ],
            [ "-", "-", "-" ],
            [ "c", "d", "e" ]
        ], [ Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, false);
    });

    test("isValid() with empty first columns with separator check returns true", () => {
        const table = new Table([
            [ "",   "  h1  ",   "  h2  ",   "  h3  " ],
            [ "",   " - "   ,   "--"    ,   "---"    ],
            [ "",   "c"     ,   "d"     ,   "e"      ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first columns without separator check returns true", () => {
        const table = new Table([
            [ "",   "  h1  ",   "  h2  ",   "  h3  " ],
            [ "",   "c"     ,   "d"     ,   "e"      ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    test("isValid() with empty last columns with separator check returns true", () => {
        const table = new Table([
            [ "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ " - "   ,   "--"    ,   "---"   , "" ],
            [ "c"     ,   "d"     ,   "e"     , "" ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, true);
    });

    test("isValid() with empty last columns without separator check returns true", () => {
        const table = new Table([
            [ "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ "c"     ,   "d"     ,   "e"     , "" ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first and last columns with separator check returns true", () => {
        const table = new Table([
            [ "",   "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ "",   " - "   ,   "--"    ,   "---"   , "" ],
            [ "",   "c"     ,   "d"     ,   "e"     , "" ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first and last columns without separator check returns true", () => {
        const table = new Table([
            [ "",   "  h1  ",   "  h2  ",   "  h3  ", "" ],
            [ "",   "c"     ,   "d"     ,   "e"     , "" ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first, middle and last columns with separator check returns true", () => {
        const table = new Table([
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   " - "   ,   ""  ,   "---"   , "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table);

        assert.equal(isValid, true);
    });

    test("isValid() with empty first, middle and last columns without separator check returns true", () => {
        const table = new Table([
            [ "",   "  h1  ",   " " ,   "  h3  ", "" ],
            [ "",   "c"     ,   "  ",   "e"     , "" ]
        ], [ Alignment.Left, Alignment.Left, Alignment.Left, Alignment.Left ]);
        const sut = createSut();

        const isValid: boolean = sut.isValid(table, false);

        assert.equal(isValid, true);
    });

    function createSut(): TableValidator {
        return new TableValidator();
    }
});