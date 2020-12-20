/* eslint-disable import/no-extraneous-dependencies */
import * as scrapers from './src/scrapers/index.js';

import assert from 'assert';
import fs from 'fs';
import mocha from 'mocha';

mocha.describe('>> unitTesting', () => {
    mocha.describe('autodiscoverGitHubPage', () => {
        const files = fs.readdirSync('./test_assets').filter((file) => file.endsWith('.html'));
        const filesForSuccess = files.filter((file) => (file.includes('repo_listing_') || file.includes('file_')));
        mocha.describe('#constructor', () => {
            files.forEach(async (file) => {
                const content = fs.readFileSync(`./test_assets/${file}`, 'utf8');
                const expectsCorrect = filesForSuccess.includes(file);
                const expectedCorrectnessLabel = expectsCorrect ? 'successfully' : 'unsuccessfully';
                mocha.it(`Deserializes ${expectedCorrectnessLabel} the file ${file}`, () => {
                    const scraperPage = scrapers.gitHub.autodiscoverGitHubPage(content);
                    assert.strictEqual(
                        scraperPage !== undefined,
                        expectsCorrect,
                    );
                });
            });
        });
        mocha.describe('#getData()', () => {
            filesForSuccess.forEach(async (file) => {
                const content = fs.readFileSync(`./test_assets/${file}`, 'utf8');
                mocha.it(`Retrieves the correct content from the file ${file}`, () => {
                    const scraperPage = scrapers.gitHub.autodiscoverGitHubPage(content);
                    const data = JSON.parse(fs.readFileSync(`./test_assets/${file}.json`, 'utf8'));
                    assert.deepStrictEqual(
                        JSON.parse(JSON.stringify(
                            scraperPage.getData() || scraperPage.getListing(),
                        )),
                        data,
                    );
                });
            });
        });
    });
});
