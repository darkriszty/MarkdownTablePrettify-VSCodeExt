import * as assert from 'assert';
import { IMock, Mock, It, Times } from "typemoq";
import { SizeLimitChecker } from '../../../src/extension/sizeLimitCheker';
import { ILogger } from '../../../src/diagnostics/logger';

suite("SizeLimitCheker Tests", () => {

    let _logger: IMock<ILogger>;

    setup(() => {
        _logger = Mock.ofType<ILogger>();
    });

    test("isWithinAllowedSizeLimit() with empty text returns true", () => {
        const sut = createSut();

        const result = sut.isWithinAllowedSizeLimit("");

        assert.equal(result, true);
    });

    test("isWithinAllowedSizeLimit() with 1 char and 0 limit returns false", () => {
        const sut = createSut(0);

        const result = sut.isWithinAllowedSizeLimit("a");

        assert.equal(result, false);
    });

    test("isWithinAllowedSizeLimit() with 2 char and 2 char limit returns true", () => {
        const sut = createSut(2);

        const result = sut.isWithinAllowedSizeLimit("ab");

        assert.equal(result, true);
    });

    test("isWithinAllowedSizeLimit() with 2 char and 3 char limit returns false", () => {
        const sut = createSut(2);

        const result = sut.isWithinAllowedSizeLimit("abc");

        assert.equal(result, false);
    });

    function createSut(limit: number = 100): SizeLimitChecker {
        return new SizeLimitChecker([_logger.object], limit);
    }
});