//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
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