import * as assert from 'assert';
import * as vscode from "vscode";
import { TableFinder } from '../../../src/tableFinding/tableFinder';
import { MarkdownTextDocumentStub } from '../../stubs/markdownTextDocumentStub';
import { TableValidator } from '../../../src/modelFactory/tableValidator';
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';

suite("TableFinder tests", () => {

    test("getTables() for an empty document returns no ranges", () => {
        let sut = getSut();
        let document = makeDocument("");

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 0);
    });

    test("getTables() for a document containing only text returns no ranges", () => {
        let sut = getSut();
        let document = makeDocument(`
            hello world
            line 2
            line 3`);

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 0);
    });

    test("getTables() for single table in entire document returns a single full document range", () => {
        let sut = getSut();
        let document = makeDocument(`|Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 1);
        assert.deepStrictEqual(tableRanges[0], new vscode.Range(0, 0, 3, Number.MAX_SAFE_INTEGER));
    });

    test("getTables() for single table the expected range is returned", () => {
        let sut = getSut();
        let document = makeDocument(`no table on first line
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer
            no table on last line`);

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 1);
        assert.deepStrictEqual(tableRanges[0], new vscode.Range(1, 0, 4, Number.MAX_SAFE_INTEGER));
    });

    test("getTables() for two tables the expected ranges are returned", () => {
        let sut = getSut();
        let document = makeDocument(`
            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer

            |Primitive Type|Size(bit)|Wrapper
            |-|-|-
            |short|16|Short
            |int|32|Integer`);

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 2);
        assert.deepStrictEqual(tableRanges[0], new vscode.Range(1, 0, 4, Number.MAX_SAFE_INTEGER));
        assert.deepStrictEqual(tableRanges[1], new vscode.Range(6, 0, 9, Number.MAX_SAFE_INTEGER));
    });

    test("getTables() jumps over invalid tables", () => {
        let sut = getSut();
        let document = makeDocument(`
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

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 2);
        assert.deepStrictEqual(tableRanges[0], new vscode.Range(1, 0, 4, Number.MAX_SAFE_INTEGER));
        assert.deepStrictEqual(tableRanges[1], new vscode.Range(9, 0, 12, Number.MAX_SAFE_INTEGER));
    });

    test("getTables() for table with alignments the expected range is returned", () => {
        let sut = getSut();
        let document = makeDocument(`no table on first line
            |Primitive Type|Size(bit)|Wrapper
            |-:|-|-
            |short|16|Short
            |int|32|Integer
            no table on last line`);

        let tableRanges = sut.getTables(document);

        assert.equal(tableRanges.length, 1);
        assert.deepStrictEqual(tableRanges[0], new vscode.Range(1, 0, 4, Number.MAX_SAFE_INTEGER));
    });

    function getSut() {
        return new TableFinder(new TableValidator(new SelectionInterpreter(true)));
    }

    function makeDocument(documentContents: string) {
        return new MarkdownTextDocumentStub(documentContents);
    }
});