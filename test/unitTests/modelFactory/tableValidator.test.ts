import * as assert from 'assert';
import { IMock, Mock, It, Times } from 'typemoq';
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { SelectionInterpreter } from '../../../src/modelFactory/selectionInterpreter';

suite("TableValidator tests", () => {

    test("isValid() with null input returns false", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(null);

        assert.equal(isValid, false);
    });

    test("isValid() with less than two rows returns false", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid("A|B");

        assert.equal(isValid, false);
    });

    test("isValid() with less than two columns returns false", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `A|
             B|`
        );

        assert.equal(isValid, false);
    });

    test("isValid() with two rows and two columns returns false", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `a|b
             c|d`
        );

        assert.equal(isValid, false);
    });

    test("isValid() with two rows and a separator and two columns returns true", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `a|b
             -|-
             c|d`
        );

        assert.equal(isValid, true);
    });

    test("isValid() with separator alignment options returns true", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `a|b|c
             -:|:-:|:-
             1|2|3`
        );

        assert.equal(isValid, true);
    });

    test("isValid() with invalid separator chars returns false", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `a|b
             -x-|--
             c|d`
        );

        assert.equal(isValid, false);
    });

    test("isValid() with mismatching row counts returns false", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `a|b
             -|-
             c|d|e`
        );

        assert.equal(isValid, false);
    });

    test("isValid() with empty first columns returns true", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `| h1 | h2 |  h3   
             |-|--|---
             |c|d|e`
        );

        assert.equal(isValid, true);
    });

    test("isValid() with empty last columns returns true", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            ` h1 | h2 |  h3  |  
             -|--|---|
             c|d|e|`
        );

        assert.equal(isValid, true);
    });

    test("isValid() with empty first and last columns returns true", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            `| h1 | h2 |  h3  |  
             |-|--|---|
             |c|d|e|`
        );

        assert.equal(isValid, true);
    });

    test("isValid() with empty first, middle and last columns returns true", () => {
        const sut = createSut();

        const isValid: boolean = sut.isValid(
            ` h1 || h2 |  h3  |  
             -|-|--|---|
             c||d|e|`
        );

        assert.equal(isValid, true);
    });

    test("isValid() uses selection interpreter to get rows and separator", () => {
        let selectionInterpreter: IMock<SelectionInterpreter> = Mock.ofType<SelectionInterpreter>();
        selectionInterpreter
            .setup(_ => _.allRows(It.isAny()))
            .returns(() => [ ["a", "b"], ["-", "-"], ["c", "d"] ])
            .verifiable(Times.once());
        selectionInterpreter
            .setup(_ => _.separator(It.isAny()))
            .returns(() => ["-", "-"])
            .verifiable(Times.once());
        const sut = createSut(selectionInterpreter.object);


        selectionInterpreter.verifyAll();
    });

    function createSut(selectionInterpreter: SelectionInterpreter = null): TableValidator {
        return new TableValidator(selectionInterpreter == null ? new SelectionInterpreter(): selectionInterpreter);
    }
});