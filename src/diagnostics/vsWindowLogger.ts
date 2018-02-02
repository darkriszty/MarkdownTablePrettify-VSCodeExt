import * as vscode from 'vscode';
import { ILogger } from "./logger";

export class VsWindowLogger implements ILogger {

    logInfo(message: string): void {
        vscode.window.showInformationMessage(message);
    }

    logError(error: string | Error): void {
        const message: string = error instanceof Error
            ? (<Error>error).message
            : error;

        vscode.window.showErrorMessage(message);
    }
}