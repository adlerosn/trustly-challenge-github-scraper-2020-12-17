import express from 'express';
import { NODE_PORT } from '../runtime_constants.js';

const index_router = express.Router();

const do_get = async (request, response) => {
    const HTTP_HOST = request.headers.host || 'localhost:' + String(NODE_PORT);
    response.json({
        'usage': `https://${HTTP_HOST}/<username>/<repository>`,
        'http_method': 'GET',
        'what_does': 'Checks if exists a repository https://github.com/<username>/<repository>' +
            ' exists and returns the lines of code by each file extension',
        'example': `https://${HTTP_HOST}/adlerosn/trustly-challenge-github-scraper-2020-12-17`,
        'what_example_does': 'Does the same as above for the URL ' +
            'https://github.com/adlerosn/trustly-challenge-github-scraper-2020-12-17'
    }).end();
};

index_router.get('/', do_get);

export { index_router };
