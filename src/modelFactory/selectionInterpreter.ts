export class SelectionInterpreter {
    public allRows(selection: string): string[][] {
        return selection.split(/\r\n|\r|\n/)
            .map(this.splitLine, this)
            .filter(arr => arr.length > 0 && !(arr.length == 1 && /^\s*$/.test(arr[0])));
    }

    public separator(selection: string): string[] {
        return this.allRows(selection).filter((v, i) => i == 1)[0];
    }

    private splitLine(line: string): string[] {
        if (line == null || line.length == 0) return [];

        let result:string[] = [],
            index = -1,
            previousSplitIndex = -1;
        while ((index = line.indexOf("|", index + 1)) > -1) {
            if (line[index - 1] != "\\") {
                result.push(line.substring(previousSplitIndex + 1, index));
                previousSplitIndex = index;
            }
        }
        result.push(line.substring(previousSplitIndex + 1));

        return result;
    }
}