export class SelectionInterpreter {
    constructor(
        private readonly _strict: boolean
    ) { }

    public allRows(selection: string): string[][] {
        let split: string[][] = selection.split(/\r\n|\r|\n/).map(this.splitLine, this);

        return this._strict
            ? split
            : split.filter(arr => arr.length > 0 && !(arr.length == 1 && /^\s*$/.test(arr[0])));
    }

    public separator(selection: string): string[] {
        return this.allRows(selection).filter((v, i) => i == 1)[0];
    }

    public splitLine(line: string): string[] {
        if (line == null || line.length == 0) return [];

        let result:string[] = [],
            index = -1,
            previousSplitIndex = -1;
        while ((index = line.indexOf("|", index + 1)) > -1) {
            if (line[index - 1] != "\\" && !this.codeBlockOpenTill(line.substr(0, index))) {
                result.push(line.substring(previousSplitIndex + 1, index));
                previousSplitIndex = index;
            }
        }
        result.push(line.substring(previousSplitIndex + 1));

        return result;
    }

    private codeBlockOpenTill(text: string): boolean {
        return (text.match(/`/g) || []).length % 2 != 0;
    }
}