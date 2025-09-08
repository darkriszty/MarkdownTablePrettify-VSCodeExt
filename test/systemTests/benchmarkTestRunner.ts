import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        const extensionTestsPath = path.resolve(__dirname, './benchmarkRunner.js');

        await runTests({ 
            extensionDevelopmentPath, 
            extensionTestsPath,
            launchArgs: ['--disable-extensions'] // Run without other extensions for cleaner benchmark
        });
    } catch (err) {
        console.error('Failed to run benchmark');
        process.exit(1);
    }
}

main();
