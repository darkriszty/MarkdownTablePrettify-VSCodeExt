import * as assert from "assert";
import { IMock, Mock, It, Times } from "typemoq";
import { TableViewModelBuilder } from "../../src/viewModelBuilders/tableViewModelBuilder";
import { TableValidator } from "../../src/modelFactory/tableValidator";

suite("TableViewModelBuilder tests", () => {

    test("build() invalid table throws exception", () => {
        const inputRows: string[][] = [];
        const validator: IMock<TableValidator> = Mock.ofType<TableValidator>();
        validator
            .setup(v => v.isValid(inputRows, false))
            .returns(() => false)
            .verifiable(Times.once());

        const vmb = createViewModelBuilder(validator.object);

        assert.throws(() => vmb.build(inputRows));
        validator.verifyAll();
    });
});

function createViewModelBuilder(validator: TableValidator): TableViewModelBuilder {
    return new TableViewModelBuilder(validator)
}