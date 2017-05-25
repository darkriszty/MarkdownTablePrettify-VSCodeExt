import * as assert from "assert";
import { assertExt } from "../assertExtensions";
import { IMock, Mock, It, Times } from "typemoq";
import { TableViewModelBuilder } from "../../src/viewModelBuilders/tableViewModelBuilder";
import { TableValidator } from "../../src/modelFactory/tableValidator";
import { TableViewModel } from "../../src/viewModels/tableViewModel";

suite("TableViewModelBuilder tests", () => {
    let _validator: IMock<TableValidator>;

    setup(() => {
        _validator = Mock.ofType<TableValidator>();
    });

    test("build() invalid table throws exception", () => {
        const inputRows: string[][] = [];
        _validator
            .setup(v => v.isValid(inputRows, false))
            .returns(() => false)
            .verifiable(Times.once());

        const vmb = createViewModelBuilder();

        assert.throws(() => vmb.build(inputRows));
        _validator.verifyAll();
    });

    /* TODO: 
        Create tests to ensure that the row view model builder is called correctly and
        that the result of the row VMB ends up in the fields: header, separator and rows.
    */

    test("build() valid table with CJK characters returns expected view model", () => {
        const inputRows: string[][] = [
            ["h", "h"],
            ["𠁻", "𣄿 content"]
        ];
        _validator
            .setup(v => v.isValid(inputRows, false))
            .returns(() => true)
            .verifiable(Times.once());

        const vm = createViewModelBuilder().build(inputRows);

        assertViewModelPropertiesSet(vm);
        assert.equal(vm.header.getValueAt(0), "h  ");
        assert.equal(vm.header.getValueAt(1), " h");
        assert.equal(vm.separator.getValueAt(0), "---");
        assert.equal(vm.separator.getValueAt(1), "------------");
        assert.equal(vm.rows.length, 1);
        assert.equal(vm.rows[0].getValueAt(0), "𠁻 ");
        assert.equal(vm.rows[0].getValueAt(1), " 𣄿 content");
        _validator.verifyAll();
    });

    function assertViewModelPropertiesSet(viewModel: TableViewModel) {
        assertExt.isNotNull(viewModel);
        assertExt.isNotNull(viewModel.header);
        assertExt.isNotNull(viewModel.separator);
        assertExt.isNotNull(viewModel.rows);
    }

    function createViewModelBuilder(): TableViewModelBuilder {
        return new TableViewModelBuilder(_validator.object)
    }
});