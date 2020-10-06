import * as assert from "assert";

export class assertExt {
    public static isNotNull(object: any): void {
        assert.strictEqual(object != null, true);
    }
}