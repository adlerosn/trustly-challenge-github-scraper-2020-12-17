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
    response.contentType('application/json').send(JSON.stringify({
        documentation: 'https://github.com/adlerosn/trustly-challenge-github-scraper-2020-12-17#readme',
        usage: `https://${HTTP_HOST}/<format>/<username>/<repository>`,
        formats: ['json', 'xml', 'yaml'],
        http_method: 'GET',
        what_does: 'Checks if exists a repository https://github.com/<username>/<repository>'
            + ' exists and returns the lines of code by each file extension with the requested <format>',
    }, {}, 4)).end();
}

home.get('/', doGet);

export default home;
