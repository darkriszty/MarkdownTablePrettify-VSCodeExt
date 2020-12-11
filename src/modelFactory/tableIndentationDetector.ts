export abstract class TableIndentationDetector {
    protected abstract hasIndentation(leftPadsPerLine: string[]): boolean;
    protected abstract getIndentationChars(leftPadsPerLine: string[]): string;

    public getLeftPad(lines: string[]): string {
        const leftPadsPerLine: string[] = lines.map(l => l.match(/^\s*/)[0]);

        return this.hasIndentation(leftPadsPerLine)
            ? this.getIndentationChars(leftPadsPerLine)
            : "";
    }
}

/**
 * If more than half of the lines have indentation, assume indentation was intended.
 * Use the indentation characters used by the majority of the lines.
 */
export class FairTableIndentationDetector extends TableIndentationDetector {

    protected hasIndentation(leftPadsPerLine: string[]): boolean {
        const totalLines: number = leftPadsPerLine.length;
        const linesWithActualLeftPadding: number = leftPadsPerLine.filter(p => p.length > 0).length;

        return linesWithActualLeftPadding >= totalLines / 2;
    }

    protected getIndentationChars(leftPadsPerLine: string[]): string {
        const nonEmptyLeftPads = leftPadsPerLine.filter(l => l.length > 0);
        let indentCounters: Map<string, number> = new Map();

        for (const leftPad of nonEmptyLeftPads) {
            let count = 1;
            if (indentCounters.has(leftPad)) {
                count += indentCounters.get(leftPad);
            }
            indentCounters.set(leftPad, ++count);
        }

        // if there is an indentation used for at least 2 distinct lines, then use that, otherwise use the first line's indentation
        const indentWithMostRepeats = [...indentCounters.entries()].reduce((prev, curr) => curr[1] > prev[1] ? curr : prev)
        return indentWithMostRepeats[1] > 1
            ? indentWithMostRepeats[0]
            : indentCounters[0];
    }
}
