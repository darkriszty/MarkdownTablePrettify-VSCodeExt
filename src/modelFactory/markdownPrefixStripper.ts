export class MarkdownPrefixStripper {

    public strip(text: string): { strippedText: string; prefixes: string[] } {
        const lines = text.match(/[^\n]*\n|[^\n]+/g) || [""];
        const prefixes: string[] = [];
        const strippedLines: string[] = [];

        for (const line of lines) {
            const prefix = this.detectPrefix(line);
            prefixes.push(prefix);
            strippedLines.push(line.substring(prefix.length));
        }

        return { strippedText: strippedLines.join(""), prefixes };
    }

    public restore(text: string, prefixes: string[]): string {
        const lines = text.match(/[^\n]*\n|[^\n]+/g) || [""];
        const result: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const prefix = i < prefixes.length ? prefixes[i] : "";
            result.push(prefix + lines[i]);
        }

        return result.join("");
    }

    private detectPrefix(line: string): string {
        let prefix = "";
        let remaining = line;

        // Layer 1: Blockquote markers (always strip - unambiguous Markdown syntax)
        const bqMatch = remaining.match(/^(\s*(?:>\s*)+)/);
        if (bqMatch) {
            prefix += bqMatch[1];
            remaining = remaining.substring(bqMatch[1].length);
        }

        // Layer 2: List markers (only strip when followed by whitespace + |, i.e., bordered tables)
        const listMatch = remaining.match(/^(\s*(?:\d+[.)]|[-*+]))(?=\s+\|)/);
        if (listMatch) {
            prefix += listMatch[1];
        }

        return prefix;
    }
}
