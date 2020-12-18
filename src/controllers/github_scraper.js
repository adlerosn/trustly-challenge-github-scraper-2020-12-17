import express from 'express';

const github_scraper_router = express.Router();

function do_get(request, response) {
    response.json({}).end();
}

github_scraper_router.get('/asd', do_get);

export { github_scraper_router };