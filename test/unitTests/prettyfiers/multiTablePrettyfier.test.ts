import * as assert from "assert";
import { IMock, Mock, Times, It } from "typemoq";
import { SizeLimitChecker } from "../../../src/prettyfiers/sizeLimit/sizeLimitChecker";
import { TableFinder } from "../../../src/tableFinding/tableFinder";
import { Range } from "../../../src/models/doc/range";
import { MultiTablePrettyfier } from "../../../src/prettyfiers/multiTablePrettyfier";
import { SingleTablePrettyfier } from "../../../src/prettyfiers/singleTablePrettyfier";

suite("MultiTablePrettyfier tests", () => {

    let _tableFinder: IMock<TableFinder>;
    let _singleTablePrettyfier: IMock<SingleTablePrettyfier>;
    let _sizeLimitChecker: IMock<SizeLimitChecker>;

    setup(() => {
        _tableFinder = Mock.ofType<TableFinder>();
        _singleTablePrettyfier = Mock.ofType<SingleTablePrettyfier>();
        _sizeLimitChecker = Mock.ofType<SizeLimitChecker>()
    });

    test("formatTables() calls size limit checker", () => {
        const sut = createSut();
        const text = "hello world";

        sut.formatTables(text);

        _sizeLimitChecker.verify(checker => checker.isWithinAllowedSizeLimit(text), Times.once());
    });

    test("formatTables() doesn't format when size exceeds allowed limit", () => {
        const sut = createSut();
        const text = "hello world";
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => false);

        sut.formatTables(text);

        _tableFinder.verify(tableFind => tableFind.getNextRange(It.isAny(), It.isAny()), Times.never());
    });

    test("formatTables() tries to get the next table range until exhausted", () => {
        const sut = createSut();
        const text = Array(10).fill("hello world").join("\n");
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => true);
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 0)).returns(() => new Range(1, 1));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 2)).returns(() => new Range(3, 3));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 4)).returns(() => new Range(8, 8));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 9)).returns(() => null);
        _singleTablePrettyfier.setup(singlePrettyfier => singlePrettyfier.prettifyTable(It.isAny(), It.isAny())).returns(() => "new text");

        sut.formatTables(text);

        _tableFinder.verify(tableFinder => tableFinder.getNextRange(It.isAny(), It.isAny()), Times.exactly(4));
    });

    test("formatTables() calls range prettyfier for each table range found", () => {
        const sut = createSut();
        const text = Array(10).fill("hello world").join("\n");
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => true);
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 0)).returns(() => new Range(1, 1));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 2)).returns(() => new Range(3, 3));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 4)).returns(() => new Range(8, 8));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 9)).returns(() => null);
        _singleTablePrettyfier.setup(singlePrettyfier => singlePrettyfier.prettifyTable(It.isAny(), It.isAny())).returns(() => "new text");

        sut.formatTables(text);

        _singleTablePrettyfier.verify(singlePrettyfier => singlePrettyfier.prettifyTable(It.isAny(), It.isAny()), Times.exactly(3));
    });

    test("formatTables() builds the result from the prettyfier result of each table", () => {
        const sut = createSut();
        const text = Array(6).fill("text").join("\n");
        _sizeLimitChecker.setup(checker => checker.isWithinAllowedSizeLimit(text)).returns(() => true);
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 0)).returns(() => new Range(1, 1));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 2)).returns(() => new Range(3, 3));
        _tableFinder.setup(tableFind => tableFind.getNextRange(It.isAny(), 4)).returns(() => null);
        _singleTablePrettyfier
            .setup(singlePrettyfier => singlePrettyfier.prettifyTable(It.isAny(), It.is<Range>(r => r.startLine === 1)))
            .returns(() => "a");
        _singleTablePrettyfier
            .setup(singlePrettyfier => singlePrettyfier.prettifyTable(It.isAny(), It.is<Range>(r => r.startLine === 3)))
            .returns(() => "b");

        const result = sut.formatTables(text);

        assert.strictEqual(result, "text\na\ntext\nb\ntext\ntext");
    });

    function createSut(): MultiTablePrettyfier {
        return new MultiTablePrettyfier(
            _tableFinder.object,
            _singleTablePrettyfier.object,
            _sizeLimitChecker.object);
    }
});