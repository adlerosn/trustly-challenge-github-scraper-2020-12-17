/* eslint-disable import/no-extraneous-dependencies */
import assert from 'assert';
import { GitHubExtensionScrappingService } from './src/services/index.js';
import mocha from 'mocha';

mocha.describe('>> integrationTesting', () => {
    mocha.describe('GitHubExtensionScrappingService', () => {
        [
            '/adlerosn/xenforoaddon_discordWebhooksAnnounce',
            '/ppy/osu-resources',
        ]
            .forEach((repository) => {
                mocha.describe(`With parameter repository="${repository}"`, () => {
                    const timeDurations = [];
                    mocha.it('#1: .scrapeGitHubRepository(repository)', async () => {
                        const startTime = Date.now();
                        // eslint-disable-next-line no-unused-vars
                        const result = await GitHubExtensionScrappingService.scrapeGitHubRepository(repository);
                        // console.log(result.statistics);
                        const endTime = Date.now();
                        timeDurations.push(endTime - startTime);
                    });
                    mocha.it('#2: .scrapeGitHubRepositoryWithoutFinalResultCaching(repository)', async () => {
                        const startTime = Date.now();
                        // eslint-disable-next-line no-unused-vars
                        const result = await GitHubExtensionScrappingService
                            .scrapeGitHubRepositoryWithoutFinalResultCaching(repository);
                        // console.log(result.statistics);
                        const endTime = Date.now();
                        timeDurations.push(endTime - startTime);
                    });
                    mocha.it('#3: .scrapeGitHubRepository(repository)', async () => {
                        const startTime = Date.now();
                        // eslint-disable-next-line no-unused-vars
                        const result = await GitHubExtensionScrappingService.scrapeGitHubRepository(repository);
                        // console.log(result.statistics);
                        const endTime = Date.now();
                        timeDurations.push(endTime - startTime);
                    });
                    mocha.it(`Final: Ensure [${timeDurations.join(', ')}] is descending`, async () => {
                        for (let i = 1; i < timeDurations.length; i += 1) {
                            assert.ok(
                                timeDurations[i - 1] + 1 >= timeDurations[i],
                                `Expected: ${timeDurations[i - 1]} >= ${timeDurations[i]}`,
                            );
                        }
                    });
                });
            });
    });
});
