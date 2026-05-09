import * as assert from 'assert';
import * as vscode from 'vscode';
import { IMock, Mock, It, Times } from 'typemoq';
import { MarkdownTextDocumentStub } from '../../stubs/markdownTextDocumentStub';
import { Document } from '../../../src/models/doc/document';
import { Range } from '../../../src/models/doc/range';
import { TableAtCursorPrettyfier } from '../../../src/prettyfiers/tableAtCursorPrettyfier';
import { TableFinder } from '../../../src/tableFinding/tableFinder';
import { SingleTablePrettyfier } from '../../../src/prettyfiers/singleTablePrettyfier';

suite('TableAtCursorPrettyfier tests', () => {

    let _tableFinder: IMock<TableFinder>;
    let _singleTablePrettyfier: IMock<SingleTablePrettyfier>;

    setup(() => {
        _tableFinder = Mock.ofType<TableFinder>();
        _singleTablePrettyfier = Mock.ofType<SingleTablePrettyfier>();
    });

    test('hasTableAtCursor() returns true when a table range contains the cursor', () => {
        const sut = createSut();
        const document = new Document('|A|B|\n|-|-|\n|1|2|');

        _tableFinder
            .setup(tableFinder => tableFinder.getRangeContainingLine(It.isAny(), 1))
            .returns(() => new Range(0, 2));

        const result = sut.hasTableAtCursor(document, 1);

        assert.strictEqual(result, true);
    });

    test('hasTableAtCursor() returns false when no table range is found', () => {
        const sut = createSut();
        const document = new Document('hello\nworld');

        _tableFinder
            .setup(tableFinder => tableFinder.getRangeContainingLine(It.isAny(), 0))
            .returns(() => null);

        const result = sut.hasTableAtCursor(document, 0);

        assert.strictEqual(result, false);
    });

    test('prettifyTableAtCursor() returns false when no table is found', async () => {
        const sut = createSut();
        const textEditor = Mock.ofType<vscode.TextEditor>();
        const document = new MarkdownTextDocumentStub('|A|B|\n|-|-|\n|1|2|');
        const selection = new vscode.Selection(0, 0, 0, 0);

        textEditor.setup(e => e.document).returns(() => document);
        textEditor.setup(e => e.selection).returns(() => selection);
        textEditor.setup(e => e.edit(It.isAny())).returns(() => Promise.resolve(true));

        _tableFinder
            .setup(tableFinder => tableFinder.getRangeContainingLine(It.isAny(), 0))
            .returns(() => null);

        const result = await sut.prettifyTableAtCursor(textEditor.object);

        assert.strictEqual(result, false);
        textEditor.verify(e => e.edit(It.isAny()), Times.never());
    });

    test('prettifyTableAtCursor() formats the table when one is found', async () => {
        const sut = createSut();
        const textEditor = Mock.ofType<vscode.TextEditor>();
        const document = new MarkdownTextDocumentStub('|A|B|\n|-|-|\n|1|2|');
        const selection = new vscode.Selection(1, 0, 1, 0);

        textEditor.setup(e => e.document).returns(() => document);
        textEditor.setup(e => e.selection).returns(() => selection);
        textEditor.setup(e => e.edit(It.isAny())).returns(() => Promise.resolve(true));

        _tableFinder
            .setup(tableFinder => tableFinder.getRangeContainingLine(It.isAny(), 1))
            .returns(() => new Range(0, 2));
        _singleTablePrettyfier
            .setup(prettifier => prettifier.prettifyTable(It.isAny(), It.isAny()))
            .returns(() => '|A|B|\n|-|-|\n|1|2|');

        const result = await sut.prettifyTableAtCursor(textEditor.object);

        assert.strictEqual(result, true);
        textEditor.verify(e => e.edit(It.isAny()), Times.once());
    });

    function createSut(): TableAtCursorPrettyfier {
        return new TableAtCursorPrettyfier(_tableFinder.object, _singleTablePrettyfier.object);
    }
});
