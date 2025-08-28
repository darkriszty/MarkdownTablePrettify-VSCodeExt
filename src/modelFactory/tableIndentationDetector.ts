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
        const nonEmptyLeftPads: string[] = leftPadsPerLine.filter(l => l.length > 0);

        // special handling for tab-based indentation: find longest common tab prefix
        let commonTabPrefixLength: number = 0;
        if (nonEmptyLeftPads.length > 0) {
            // find the shortest indent length from all lines
            let shortestLength: number = nonEmptyLeftPads[0].length;
            for (let i: number = 1; i < nonEmptyLeftPads.length; i++) {
                if (nonEmptyLeftPads[i].length < shortestLength) {
                    shortestLength = nonEmptyLeftPads[i].length;
                }
            }

            // check each char across all pads up untl the shortest length
            for (let pos: number = 0; pos < shortestLength; pos++) {
                if (nonEmptyLeftPads.every(pad => pad[pos] === '\t')) {
                    // tabs are persistent indent char(s) up until here on all lines
                    commonTabPrefixLength = pos + 1;
                } else {
                    // early exit when first non-tab is found
                    break;
                }
            }
        }

        if (commonTabPrefixLength > 0) {
            return '\t'.repeat(commonTabPrefixLength);
        }

        // Fallback to original logic
        let indentCounters: Map<string, number> = new Map();

        for (const leftPad of nonEmptyLeftPads) {
            let count: number = 1;
            if (indentCounters.has(leftPad)) {
                count += indentCounters.get(leftPad)!;
            }
            indentCounters.set(leftPad, ++count);
        }

        // if there is an indentation used for at least 2 distinct lines, then use that, otherwise use the first line's indentation
        const indentWithMostRepeats: [string, number] = [...indentCounters.entries()].reduce((prev, curr) => curr[1] > prev[1] ? curr : prev)
        
        return indentWithMostRepeats[1] > 1
            ? indentWithMostRepeats[0]
            : nonEmptyLeftPads[0];
    }
}
