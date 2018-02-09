import * as assert from "assert";

export class assertExt {
    public static isNotNull(object: any): void {
        assert.equal(object != null, true);
    }
}