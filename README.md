# Markdown table prettifier extension for Visual Studio Code

[![Build Status](https://travis-ci.org/darkriszty/MarkdownTablePrettify-VSCodeExt.svg?branch=master)](https://travis-ci.org/darkriszty/MarkdownTablePrettify-VSCodeExt)

Makes tables more readable for humans. Compatible with the Markdown writer plugin's table formatter feature in Atom.

## Features

- Remove redundant ending table border if the beginning has no border, so the table _will not end_ with "|".
- Create missing ending table border if the beginning already has a border, so the table _will end_ with "|".

![feature X](assets/animation.gif)

## Extension Settings

The extension is available for markdown (_.md_) files. To format a table just select the entire table, then right click to format the selection.

## Known Issues

- Formatting multiple tables at once and formatting an entire file is not supported.
- The extension is not yet published.