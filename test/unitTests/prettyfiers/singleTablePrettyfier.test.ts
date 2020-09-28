
import * as assert from "assert";
import { IMock, Mock, Times, It } from "typemoq";
import { TableFactory } from "../../../src/modelFactory/tableFactory";
import { TableValidator } from "../../../src/modelFactory/tableValidator";
import { TableViewModelFactory } from "../../../src/viewModelFactories/tableViewModelFactory";
import { TableStringWriter } from "../../../src/writers/tableStringWriter";
import { ILogger } from "../../../src/diagnostics/logger";
import { SizeLimitChecker } from "../../../src/prettyfiers/sizeLimit/sizeLimitChecker";
import { SingleTablePrettyfier } from "../../../src/prettyfiers/singleTablePrettyfier";
import { Document } from "../../../src/models/doc/document";
import { Table } from "../../../src/models/table";
import { Range } from "../../../src/models/doc/range";
import { TableViewModel } from "../../../src/viewModels/tableViewModel";

suite("SingleTablePrettyfier Tests", () => {

    let _tableFactory: IMock<TableFactory>;
    let _tableValidator: IMock<TableValidator>;
    let _viewModelFactory: IMock<TableViewModelFactory>;
    let _writer: IMock<TableStringWriter>;
    let _logger: IMock<ILogger>;
    let _sizeLimitChecker: IMock<SizeLimitChecker>;

    setup(() => {
        _tableFactory = Mock.ofType<TableFactory>();
        _tableValidator = Mock.ofType<TableValidator>();
        _viewModelFactory = Mock.ofType<TableViewModelFactory>();
        _writer = Mock.ofType<TableStringWriter>();
        _logger = Mock.ofType<ILogger>();
        _sizeLimitChecker = Mock.ofType<SizeLimitChecker>();
    });

    test("prettifyTable() for valid input the expected result is returned", () => {
        const sut = createSut();
        const inputText = "hello world";
        const range = new Range(0, 1);
        const document = new Document(inputText);
        const table = new Table([], "", []);
        const tableViewModel = new TableViewModel();
        const expectedResult = "expected result";
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(inputText)).returns(() => true);
        _tableValidator.setup(validator => validator.isValid(inputText)).returns(() => true);
        _tableFactory.setup(factory => factory.getModel(document, range)).returns(() => table);
        _viewModelFactory.setup(factory => factory.build(table)).returns(() => tableViewModel);
        _writer.setup(writer => writer.writeTable(tableViewModel)).returns(() => expectedResult);

        const result = sut.prettifyTable(document, range);

        assert.strictEqual(result, expectedResult);
        _sizeLimitChecker.verify(checker => checker.isWithinAllowedSizeLimit(inputText), Times.once());
        _tableValidator.verify(validator => validator.isValid(inputText), Times.once());
        _tableFactory.verify(factory => factory.getModel(document, range), Times.once());
        _viewModelFactory.verify(factory => factory.build(table), Times.once());
        _writer.verify(writer => writer.writeTable(tableViewModel), Times.once());
    });

    test("prettifyTable() when the size is too big the table is not formatted", () => {
        const sut = createSut();
        const inputText = "hello world";
        const document = new Document(inputText);
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(inputText)).returns(() => false);

        const result = sut.prettifyTable(document, null);

        assert.strictEqual(result, inputText);
        _sizeLimitChecker.verify(checker => checker.isWithinAllowedSizeLimit(inputText), Times.once());
        _tableFactory.verify(factory => factory.getModel(It.isAny(), It.isAny()), Times.never());
    });

    test("prettifyTable() when the table is not valid an info is logged", () => {
        const sut = createSut();
        const inputText = "hello world";
        const document = new Document(inputText);
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(inputText)).returns(() => true);
        _tableValidator.setup(validator => validator.isValid(inputText)).returns(() => false);

        const result = sut.prettifyTable(document, null);

        assert.strictEqual(result, inputText);
        _sizeLimitChecker.verify(checker => checker.isWithinAllowedSizeLimit(inputText), Times.once());
        _tableValidator.verify(validator => validator.isValid(inputText), Times.once());
        _tableFactory.verify(factory => factory.getModel(It.isAny(), It.isAny()), Times.never());
        _logger.verify(logger => logger.logInfo(It.isAny()), Times.once());
    });

    function createSut(): SingleTablePrettyfier {
        return new SingleTablePrettyfier(
            _tableFactory.object, _tableValidator.object,
            _viewModelFactory.object, _writer.object,
            [ _logger.object ], _sizeLimitChecker.object);
    }
});