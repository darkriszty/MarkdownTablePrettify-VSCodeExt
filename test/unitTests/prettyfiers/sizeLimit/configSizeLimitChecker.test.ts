import * as assert from 'assert';
import { IMock, Mock } from "typemoq";
import { ConfigSizeLimitChecker } from '../../../../src/prettyfiers/sizeLimit/configSizeLimitCheker';
import { ILogger } from '../../../../src/diagnostics/logger';

suite("ConfigSizeLimitCheker Tests", () => {

    let _logger: IMock<ILogger>;

    setup(() => {
        _logger = Mock.ofType<ILogger>();
    });

    test("isWithinAllowedSizeLimit() with empty text returns true", () => {
        const sut = createSut();

        const result = sut.isWithinAllowedSizeLimit("");

        assert.strictEqual(result, true);
    });

    test("isWithinAllowedSizeLimit() with 1 char and 0 limit returns false", () => {
        const sut = createSut(0);

        const result = sut.isWithinAllowedSizeLimit("a");

        assert.strictEqual(result, false);
    });

    test("isWithinAllowedSizeLimit() with 2 char and 2 char limit returns true", () => {
        const sut = createSut(2);

        const result = sut.isWithinAllowedSizeLimit("ab");

        assert.strictEqual(result, true);
    });

    test("isWithinAllowedSizeLimit() with 2 char and 3 char limit returns false", () => {
        const sut = createSut(2);

        const result = sut.isWithinAllowedSizeLimit("abc");

        assert.strictEqual(result, false);
    });

    function createSut(limit: number = 100): ConfigSizeLimitChecker {
        return new ConfigSizeLimitChecker([_logger.object], limit);
    }
});