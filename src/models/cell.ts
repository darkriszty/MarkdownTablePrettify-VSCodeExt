export class Cell {
    private static readonly _segmenter = new Intl.Segmenter();
    // gives the widths string-width reports, which markdownlint's MD060 uses to measure tables
    private static readonly _emoji = /^(?:\p{Emoji_Presentation}|\p{Emoji}\u{FE0F})/u;
    private static readonly _mayContainEmoji = /[\p{Emoji_Presentation}\u{FE0F}]/u;

    private _value: string;

    constructor(value: string) {
        this._value = value;
    }

    public getValue(): string {
        return this._value;
    }

    public getLength(): number {
        if (!Cell._mayContainEmoji.test(this._value))
            return this.getCharsDisplayLength(this._value);

        let length: number = 0;

        for (const { segment } of Cell._segmenter.segment(this._value))
            length += Cell._emoji.test(segment) ? 2 : this.getCharsDisplayLength(segment);

        return length;
    }

    private getCharsDisplayLength(text: string): number {
        let length: number = 0;

        for (let i = 0, n = text.length; i < n; i++)
            length += this.getCharDisplayLength(text.charAt(i));

        return length;
    }

    private getCharDisplayLength(character: string): number {
        // handle the most probable zero-width characters
        if (/^[\u{200B}-\u{200F}\u{2060}-\u{2064}\u{FEFF}\u{034F}\u{061C}\u{00AD}]$/u.test(character))
            return 0;

        // for the specified ranges use a length of 2, otherwise a length of 1
        return /^(([\u{4E00}-\u{9FFF}])|([\u{3400}-\u{4DBF}])|([\u{20000}-\u{2A6DF}])|([\u{2A700}-\u{2B73F}])|([\u{2B740}-\u{2B81F}]))$/u.test(character)
            ? 2
            : 1;
    }
}