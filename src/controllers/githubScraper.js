import express from 'express';

const githubScraper = express.Router();

/**
 * Checks a given GitHub repository for the site
 *
 * @param {express.Request} request Handler for accessing request data
 * @param {express.Response} response Handler for sending response data
 */
async function doGet(request, response) {
    response.json({}).end();
}

githubScraper.get('*', doGet);

export default githubScraper;
