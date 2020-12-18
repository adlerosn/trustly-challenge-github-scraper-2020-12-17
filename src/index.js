import cors from 'cors';
import express from 'express';
import { NODE_PORT } from './runtime_constants.js';
import { index_router } from './controllers/index.js';
import { github_scraper_router } from './controllers/github_scraper.js';

let app = express();
app.use(cors());

app.use('', index_router);
app.use('', github_scraper_router);

app.listen(NODE_PORT, () => {
    console.log(`Listening to http://localhost:${NODE_PORT}`);
});
