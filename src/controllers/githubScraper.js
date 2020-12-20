import express from 'express';
import { getSerializer } from '../serializers/index.js';
import { GitHubExtensionScrappingService } from '../services/index.js';
import { Try } from './interfaces/index.js';

const githubScraper = express.Router();

/**
 * Checks a given GitHub repository for the site
 *
 * @param {express.Request} request Handler for accessing request data
 * @param {express.Response} response Handler for sending response data
 */
async function doGet(request, response) {
    const outFormat = request.params.format;
    const repository = request.url.substr(outFormat.length + 1);
    const tried = await Try.buildFromPromise(
        GitHubExtensionScrappingService.scrapeGitHubRepository(repository),
    );
    if (tried.isFailure()) {
        response.status(500);
    }
    const serializer = getSerializer(outFormat, 'json');
    response.contentType(serializer.mimeType());
    response.send(serializer.serialize(tried.displayable));
    response.end();
}

githubScraper.get('/:format/*', doGet);

export default githubScraper;
