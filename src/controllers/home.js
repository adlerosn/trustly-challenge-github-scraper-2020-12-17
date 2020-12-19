import express from 'express';
import { NODE_PORT } from '../runtimeConstants.js';

const home = express.Router();

/**
 * Provides a home page for the site
 *
 * @param {express.Request} request Handler for accessing request data
 * @param {express.Response} response Handler for sending response data
 */
async function doGet(request, response) {
    const HTTP_HOST = request.headers.host || `localhost:${String(NODE_PORT)}`;
    response.json({
        usage: `https://${HTTP_HOST}/<username>/<repository>`,
        http_method: 'GET',
        what_does: 'Checks if exists a repository https://github.com/<username>/<repository>'
      + ' exists and returns the lines of code by each file extension',
        example: `https://${HTTP_HOST}/adlerosn/trustly-challenge-github-scraper-2020-12-17`,
        what_example_does: 'Does the same as above for the URL '
      + 'https://github.com/adlerosn/trustly-challenge-github-scraper-2020-12-17',
    }).end();
}

home.get('/', doGet);

export default home;
