import * as assert from 'assert';
import * as vscode from 'vscode';
import { IMock, Mock, It } from 'typemoq';
import { MarkdownTextDocumentStub } from '../../stubs/markdownTextDocumentStub';
import { TableAtCursorContextKeyUpdater } from '../../../src/extension/tableAtCursorContextKeyUpdater';
import { TableAtCursorPrettyfier } from '../../../src/prettyfiers/tableAtCursorPrettyfier';

suite('TableAtCursorContextKeyUpdater tests', () => {
    let _tableAtCursorPrettyfier: IMock<TableAtCursorPrettyfier>;
    let executedCommands: Array<{ command: string, args: any[] }>;
    let executeCommand: (command: string, ...args: any[]) => Thenable<unknown>;

    setup(() => {
        _tableAtCursorPrettyfier = Mock.ofType<TableAtCursorPrettyfier>();
        executedCommands = [];
        executeCommand = (command: string, ...args: any[]) => {
            executedCommands.push({ command, args });
            return Promise.resolve(true);
        };
    });

    test('update() sets context false for unsupported language and clears cache', async () => {
        const sut = createSut();
        const document = new MarkdownTextDocumentStub('|A|B|\n|-|-|\n|1|2|');
        document.languageId = 'text';
        document.version = 1;
        document.uri = vscode.Uri.file('test.md');

        const textEditor = Mock.ofType<vscode.TextEditor>();
        textEditor.setup(e => e.document).returns(() => document);
        textEditor.setup(e => e.selection).returns(() => new vscode.Selection(0, 0, 0, 0));

        await sut.update(textEditor.object);

        assert.strictEqual(executedCommands.length, 1);
        assert.strictEqual(executedCommands[0].command, 'setContext');
        assert.deepStrictEqual(executedCommands[0].args, ['markdownTablePrettify.hasTableAtCursor', false]);
    });

    test('update() caches repeated editor state and does not call setContext again', async () => {
        const sut = createSut();
        const document = new MarkdownTextDocumentStub('|A|B|\n|-|-|\n|1|2|');
        document.languageId = 'markdown';
        document.version = 1;
        document.uri = vscode.Uri.file('test.md');

        const selection = new vscode.Selection(0, 0, 0, 0);
        const textEditor = Mock.ofType<vscode.TextEditor>();
        textEditor.setup(e => e.document).returns(() => document);
        textEditor.setup(e => e.selection).returns(() => selection);

        _tableAtCursorPrettyfier
            .setup(prettifier => prettifier.hasTableAtCursor(It.isAny(), 0))
            .returns(() => true);

        await sut.update(textEditor.object);
        await sut.update(textEditor.object);

        assert.strictEqual(executedCommands.length, 1);
        assert.strictEqual(executedCommands[0].command, 'setContext');
        assert.deepStrictEqual(executedCommands[0].args, ['markdownTablePrettify.hasTableAtCursor', true]);
    });

    test('update() with changed line calls setContext again', async () => {
        const sut = createSut();
        const document = new MarkdownTextDocumentStub('|A|B|\n|-|-|\n|1|2|');
        document.languageId = 'markdown';
        document.version = 1;
        document.uri = vscode.Uri.file('test.md');

        const textEditor = Mock.ofType<vscode.TextEditor>();
        textEditor.setup(e => e.document).returns(() => document);
        textEditor.setup(e => e.selection).returns(() => new vscode.Selection(0, 0, 0, 0));

        _tableAtCursorPrettyfier
            .setup(prettifier => prettifier.hasTableAtCursor(It.isAny(), 0))
            .returns(() => true);

        await sut.update(textEditor.object);

        textEditor.setup(e => e.selection).returns(() => new vscode.Selection(1, 0, 1, 0));
        _tableAtCursorPrettyfier
            .setup(prettifier => prettifier.hasTableAtCursor(It.isAny(), 1))
            .returns(() => false);

        await sut.update(textEditor.object);

        assert.strictEqual(executedCommands.length, 2);
        assert.deepStrictEqual(executedCommands[1].args, ['markdownTablePrettify.hasTableAtCursor', false]);
    });

    function createSut(): TableAtCursorContextKeyUpdater {
        return new TableAtCursorContextKeyUpdater(
            ['markdown'],
            'markdownTablePrettify.hasTableAtCursor',
            _tableAtCursorPrettyfier.object,
            executeCommand
        );
    }
});
