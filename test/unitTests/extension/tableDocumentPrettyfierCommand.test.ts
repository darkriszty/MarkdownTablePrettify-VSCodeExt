import * as vscode from 'vscode';
import { IMock, Mock, Times, It } from "typemoq";
import { TableDocumentPrettyfierCommand } from "../../../src/extension/tableDocumentPrettyfierCommand";
import { MarkdownTextDocumentStub } from "../../stubs/markdownTextDocumentStub";
import { MultiTablePrettyfier } from "../../../src/prettyfiers/multiTablePrettyfier";

suite("TableDocumentPrettyfierCommand tests", () => {

    let _multiTablePrettyfier: IMock<MultiTablePrettyfier>;

    setup(() => {
        _multiTablePrettyfier = Mock.ofType<MultiTablePrettyfier>();
    });

    test("prettifyDocument() calls MultiTablePrettyfier and edit()", () => {
        const sut = createSut();
        const input = Array(10).fill("hello world").join("\n");
        const expectedResult = Array(10).fill("expected result").join("\n");
        const textEditor = Mock.ofType<vscode.TextEditor>();
        const document = new MarkdownTextDocumentStub(input);
        textEditor.setup(e => e.document).returns(() => document);
        // Note: due to a limitation of the MarkdownTextDocumentStub with OS line endings, we use `It.isAny()` instead of `input`.
        _multiTablePrettyfier.setup(multiTablePrettyfier => multiTablePrettyfier.formatTables(It.isAny())).returns(() => expectedResult)

        sut.prettifyDocument(textEditor.object);

        textEditor.verify(e => e.edit(It.isAny()), Times.once());
        _multiTablePrettyfier.verify(multiTablePrettyfier => multiTablePrettyfier.formatTables(It.isAny()), Times.once());
    });

    test("prettifyDocument() for non-markdown documents it still calls MultiTablePrettyfier and edit()", () => {
        const sut = createSut();
        const input = Array(10).fill("hello world").join("\n");
        const expectedResult = Array(10).fill("expected result").join("\n");
        const textEditor = Mock.ofType<vscode.TextEditor>();
        const document = new MarkdownTextDocumentStub(input);
        document.languageId = "text";
        textEditor.setup(e => e.document).returns(() => document);
        _multiTablePrettyfier.setup(multiTablePrettyfier => multiTablePrettyfier.formatTables(It.isAny())).returns(() => expectedResult)

        sut.prettifyDocument(textEditor.object);

        textEditor.verify(e => e.edit(It.isAny()), Times.once());
        _multiTablePrettyfier.verify(multiTablePrettyfier => multiTablePrettyfier.formatTables(It.isAny()), Times.once());
    });

    function createSut(): TableDocumentPrettyfierCommand {
        return new TableDocumentPrettyfierCommand(_multiTablePrettyfier.object);
    }
});