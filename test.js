/* eslint-disable sort-imports */
/* eslint-disable import/no-extraneous-dependencies */
import assert from 'assert';
import mocha from 'mocha';
import parseHtml from './src/xmlTools/htmlParser/index.js';

mocha.describe('HtmlParser', () => {
    mocha.describe('#construct()', () => {
        mocha.it('should deserialize correctly', () => {
            assert.strictEqual(
                parseHtml('<a href="http://example.com">').toString(),
                '<a href="http://example.com" />',
            );
        });
        mocha.it('should deserialize correctly', () => {
            assert.strictEqual(
                parseHtml('<p> a <BR>b</p>').toString(),
                '<p> a <br />b</p>',
            );
        });
    });
});

mocha.describe('HtmlXmlWrapper', () => {
    mocha.describe('#findById(_)', () => {
        mocha.describe('#getAttribute(_)', () => {
            mocha.it('should be able to find an element by id and retrieve some attribute', () => {
                assert.strictEqual(
                    parseHtml('<p id=def><a id=abc href="http://example.com"></p>')
                        .findById('abc')
                        .next().value
                        .getAttribute('href'),
                    'http://example.com',
                );
            });
        });
    });
    mocha.describe('#getRecursiveChildrenTag(_)', () => {
        mocha.describe('#getAbsoluteHref()', () => {
            mocha.it('should get absolute links', () => {
                assert.notStrictEqual(
                    parseHtml('<a href="http://example.com">')
                        .getRecursiveChildrenTag('a')
                        .next().value
                        .getAbsoluteHref(),
                    new URL('http://example.com'),
                );
            });
            mocha.it('should get abolute links from relative paths', () => {
                assert.notStrictEqual(
                    parseHtml('<a href="/example.txt">', 'http://example.com')
                        .getRecursiveChildrenTag('a')
                        .next().value
                        .getAbsoluteHref(),
                    new URL('http://example.com/example.txt'),
                );
            });
            mocha.it('should get abolute links from relative paths in pages with a base', () => {
                assert.notStrictEqual(
                    parseHtml('<base href="http://example.com"><a href="/example.txt">')
                        .getRecursiveChildrenTag('a')
                        .next().value
                        .getAbsoluteHref(),
                    new URL('http://example.com/example.txt'),
                );
            });
        });
    });
});
