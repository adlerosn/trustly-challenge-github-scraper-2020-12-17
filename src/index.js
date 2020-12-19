import cors from 'cors';
import express from 'express';
import githubScraper from './controllers/githubScraper.js';
import home from './controllers/home.js';
import { NODE_PORT } from './runtimeConstants.js';

const app = express();
app.disable('x-powered-by');
app.use(cors());

app.use('', home);
app.use('', githubScraper);

app.listen(NODE_PORT, () => {
    console.log(`Listening to http://localhost:${NODE_PORT}`);
});
