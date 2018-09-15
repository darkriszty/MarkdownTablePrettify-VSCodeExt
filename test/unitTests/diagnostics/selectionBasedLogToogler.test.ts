import { IMock, Mock, Times } from "typemoq";
import { SelectionBasedLogToogler } from "../../../src/diagnostics/selectionBasedLogToogler";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { ILogger } from "../../../src/diagnostics/logger";

suite("SelectionBasedLogToogler tests", () => {

    test("toogleLoggers() with entire document disables all loggers", () => {
        const loggerMocks: IMock<ILogger>[] = [ Mock.ofType<ILogger>(), Mock.ofType<ILogger>() ];
        const document = new MarkdownTextDocumentStub("test");
        const sut = new SelectionBasedLogToogler(document, document.getFullRange());

        sut.toogleLoggers(loggerMocks.map(_ => _.object));

        loggerMocks.forEach(m => m.verify(_ => _.setEnabled(false), Times.once()));
    });

    test("toogleLoggers() with document fagment enables all loggers", () => {
        const loggerMocks: IMock<ILogger>[] = [ Mock.ofType<ILogger>(), Mock.ofType<ILogger>() ];
        const document = new MarkdownTextDocumentStub(
        `test
        test`);
        const sut = new SelectionBasedLogToogler(document, document.getRangeForLines(1, 1));

        sut.toogleLoggers(loggerMocks.map(_ => _.object));

        loggerMocks.forEach(m => m.verify(_ => _.setEnabled(true), Times.once()));
    });
});