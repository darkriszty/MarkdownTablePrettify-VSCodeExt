import { Line } from "./line";
import { Range } from "./range";

export class Document {
    private _lines: Line[];

    constructor(text: string) {
        this._lines = this.buildLines(text);
    }

    public get lines(): Line[] {
        return this._lines;
    }

    public get fullRange(): Range {
        return new Range(0, this._lines.length);
    }

    public getLines(range: Range): Line[] {
        return range == null
            ? this.lines
            : this.lines.slice(range.startLine, range.endLine + 1);
    }

    public getText(range: Range = null): string {
        const lines = this.getLines(range);

        return lines.reduce((acc, curr, index) => {
            // avoid adding the line break for the last line for range selections
            const eol = range != null && index == lines.length - 1
                ? ""
                : curr.EOL;

            return acc += curr.value + eol;
        }, "");
    }

    public replaceTextInRange(range: Range, newText: string): void {
        const newLines = this.buildLines(newText);

        if (range.endLine - range.startLine + 1 !== newLines.length) {
            throw new Error("Unexpected range length of text to replace.");
        }

        // preserve the EOL of the last line, as the newText does not have it
        newLines[newLines.length - 1].EOL = this.lines[range.endLine].EOL;
        for (let i = range.startLine; i <= range.endLine; i++) {
            this.lines[i] = newLines[i - range.startLine];
        }
    }

    private buildLines(text: string): Line[] {
        return (text.match(/[^\n]*\n|[^\n]+/g) || [""]).map(row => new Line(row));
    }
}
