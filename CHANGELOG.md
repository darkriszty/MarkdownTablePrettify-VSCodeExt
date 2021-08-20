# Change Log

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## 3.5.0 - 2021-08-20
### Added
- Issue #60: Ignore whitespaces around alignment markers.

## 3.4.0 - 2021-04-04
### Added
- Issue #56: Support ignoring parts of documents with an ignore directive.

## 3.3.0 - 2021-03-25
### Added
- Issue #54: Config to support more languages in VSCode formatting.

## 3.2.2 - 2021-01-11
### Added
- Issue #49: NPM package support.

## 3.2.1 - 2021-01-01
### Fixed
- Issue #50: Dockerfile improvements.

## 3.2.0 - 2020-12-14
### Added
- Issue #47: Support for indented tables.

## 3.1.0 - 2020-11-04
### Fixed
- Issue #42: Don't alter selection for invalid range formatting attempt (does not impact CLI).
- Issue #43: Handle `Format Selection` with multiple tables (does not impact CLI).

## 3.0.0 - 2020-10-06
### Added
- Issue #32: Major refactoring to support CLI. Support `npm run prettify-md` and `npm run check-md`.
- Issue #40: Provide command to run alongside prettier (shortcut `CTRL+ALT+M`).

## 2.5.0 - 2020-07-04
### Added
- Issue #30: Add configurable text limit for table formatting

## 2.4.0 - 2019-05-11
### Added
- Issue #28: Add the possibility to disable window messages from the extension

## 2.3.0 - 2018-12-16
### Added
- Issue #7: Support formatting all tables in the document.

## 2.2.0 - 2018-09-26
### Added
- Issue #22: Allow formatting without a filename

## 2.1.0 - 2018-09-15
### Added
- Issue #15: Support alignment options

## 2.0.0 - 2018-02-09
### Added
- Issue #12: Full rewrite for refactoring.
- Issue #11: Support escaping of separators with backslash.
- Issue #16: Ignore separators that are in code blocks.

## 1.1.1 - 2017-05-27
### Fixed
- Issue #10: Don't show format failure messages when using the `Format Document` from VsCode.

## 1.1.0 - 2017-05-09
### Added
- Issue #6: Formatting when there's only a single table in the entire file.
- Issue #4: Add support for CJK characters.

## 1.0.1 - 2017-04-08
### Fixed
- Fixed issue #1 by improving the detection of header separator to avoid unintended table formatting failures.

## 1.0.0 - 2017-04-03
### Added
- Support to format individual tables with right click -> `Format Selection`.
