import * as assert from 'assert';
import * as vscode from 'vscode';

suite("Extension Tests", () => {
    const _extensionName = "darkriszty.markdown-table-prettify";

    test("Extension exists", () => {
        assert.ok(vscode.extensions.getExtension(_extensionName));
    });

    test("Extension gets activated", () => {
         vscode.extensions.getExtension(_extensionName)
            .activate()
            .then((publicApi) => {
                    assert.ok(true);
                }, rejectReason => {
                    assert.fail(0, 1, `Extension not activated. Reason: ${rejectReason}`, null);
                }
            );
    });
});