import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { TableFactory } from "../../src/modelFactory/tableFactory";
import { TableValidator } from "../../src/modelFactory/tableValidator";

suite("TableFactory tests", () => {
    let _mockValidator: IMock<TableValidator>;

    beforeEach(function(){
        _mockValidator = Mock.ofType<TableValidator>();
    });

    test("Invalid table throws error and calls validator", () => {
        const tableText = "invalid";
        _mockValidator.setup(m => m.isValid(It.isAny(), true)).returns(() => false).verifiable(Times.once());
        const sut = createFactory();

        assert.throws(() => sut.getModel(tableText))
        _mockValidator.verifyAll();
    });

    test("Removes separator row and returns expected cells", () => {
        const tableText = `
            c1 | c2 | | c4
            -|-|-|-
            a | b || d`;
        _mockValidator.setup(m => m.isValid(It.isAny(), true)).returns(() => true).verifiable(Times.once());
        const sut = createFactory();

        const cells: string[][] = sut.getModel(tableText);

        assert.equal(cells != null, true);
        assert.equal(cells.length, 2);
        assert.equal(cells.every(r => r.length == 4), true);
        assert.equal(cells[0][0], "            c1 ");
        assert.equal(cells[0][1], " c2 ");
        assert.equal(cells[0][2], " ");
        assert.equal(cells[0][3], " c4");
        assert.equal(cells[1][0], "            a ");
        assert.equal(cells[1][1], " b ");
        assert.equal(cells[1][2], "");
        assert.equal(cells[1][3], " d");
        _mockValidator.verifyAll();
    });

    function createFactory(): TableFactory {
        return new TableFactory(_mockValidator.object);
    }
});