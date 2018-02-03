export class SelectionInterpreter {
    public allRows(selection: string): string[][] {
        return selection.split(/\r\n|\r|\n/)
            .map(l => l.split("|"))
            .filter(arr => !(arr.length == 1 && /^\s*$/.test(arr[0])));
    }

    public separator(selection: string): string[] {
        return this.allRows(selection).filter((v, i) => i == 1)[0];
    }
}