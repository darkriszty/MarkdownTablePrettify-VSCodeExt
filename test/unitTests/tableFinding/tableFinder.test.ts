import * as assert from 'assert';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';
import { TableValidator } from '../../../src/modelFactory/tableValidator';
import { Document } from '../../../src/models/doc/document';
import { Range } from '../../../src/models/doc/range';
import { TableFinder } from '../../../src/tableFinding/tableFinder';

suite("TableFinder tests", () => {

    test("getNextRange() for an empty document returns no range", () => {
        const sut = createSut();
        const document = new Document("");

        let range = sut.getNextRange(document, 0);

        assert.strictEqual(range, null);
    });

    test("getNextRange() for a document containing only text returns no range", () => {
        const sut = createSut();
        const document = new Document(`
            hello world
            line 2
            line 3`);

        let range = sut.getNextRange(document, 0);

        assert.strictEqual(range, null);
    });

    test("getNextRange() with document having a full range table returns full doc range", () => {
        const sut = createSut();
        const document = new Document(`|Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(0, 3));
    });

    test("getNextRange() for single table the expected range is returned", () => {
        const sut = createSut();
        const document = new Document(`no table on first line
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer
            no table on last line`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(1, 4));
    });

    test("getNextRange() for two tables when searched from beginning finds the first table range", () => {
        const sut = createSut();
        const document = new Document(`
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer

            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(1, 4));
    });

    test("getNextRange() for two tables when searched from the end of first finds the second table range", () => {
        const sut = createSut();
        const document = new Document(`
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer

            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let range = sut.getNextRange(document, 5);

        assert.deepStrictEqual(range, new Range(6, 9));
    });

    test("getNextRange() jumps over invalid tables", () => {
        const sut = createSut();
        const document = new Document(`
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer

            |Invalid|
            |-|-

            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let range = sut.getNextRange(document, 5);

        assert.deepStrictEqual(range, new Range(9, 12));
    });

    test("getNextRange() for table with alignments the expected range is returned", () => {
        const sut = createSut();
        const document = new Document(`no table on first line
            |Primitive Type|Size(bit)|Wrapper
            |-:|-|-
            |short|16|Short
            |int|32|Integer
            no table on last line`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(1, 4));
    });

    test("getNextRange() for single table after a start ignore the table is not found", () => {
        const sut = createSut();
        const document = new Document(`<!-- markdown-table-prettify-ignore-start -->
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer
            no table on last line`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, null);
    });

    test("getNextRange() for single table having a start ignore in the middle the expected range is returned", () => {
        const sut = createSut();
        const document = new Document(`no table on first line
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            <!-- markdown-table-prettify-ignore-start -->
            |int|32|Integer
            no table on last line`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(1, 3));
    });

    test("getNextRange() table after an end ignore is found", () => {
        const sut = createSut();
        const document = new Document(`no table on first line
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            <!-- markdown-table-prettify-ignore-start -->
            |short|16|Short
            |int|32|Integer
            |int|32|Integer
            <!-- markdown-table-prettify-ignore-end -->
            |int|32|Integer

            |Invalid|
            |-|-

            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(13, 16));
    });

    test("getNextRange() table after ignore-end but without an ignore-start is found without any ignoring effect", () => {
        const sut = createSut();
        const document = new Document(`no table on first line

            |Invalid|
            |-|-

            <!-- markdown-table-prettify-ignore-end -->
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let range = sut.getNextRange(document, 0);

        assert.deepStrictEqual(range, new Range(6, 9));
    });

    function createSut() {
        return new TableFinder(new TableValidator(new SelectionInterpreter(true)));
    }
});