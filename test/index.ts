import * as path from 'path';

import { runTests } from 'vscode-test';

async function main() {
	try {
		// The paths are relative from the `/out/test` folder.
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');
		const extensionTestsPath = path.resolve(__dirname, './suite');

		// Download VS Code, unzip it and run the integration test
		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [
				// This disables all extensions except the one being tested.
				'--disable-extensions'
			],
		});
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();