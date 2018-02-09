import * as vscode from 'vscode';
import { ILogger } from "./logger";
import { BaseLogger } from './baseLogger';

export class VsWindowLogger extends BaseLogger implements ILogger {

    public logInfo(message: string): void {
        super.logIfEnabled(vscode.window.showInformationMessage, message);
    }

    public logError(error: string | Error): void {
        const message: string = error instanceof Error
            ? (<Error>error).message
            : error;
        super.logIfEnabled(vscode.window.showErrorMessage, message);
    }
}