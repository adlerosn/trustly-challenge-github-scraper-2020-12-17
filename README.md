Trustly challenge: GitHub scraper
=================================

| | | |
|:---:|:---:|:---:|
| [![TravisCI](https://api.travis-ci.com/adlerosn/trustly-challenge-github-scraper-2020-12-17.svg?branch=master)](https://travis-ci.com/github/adlerosn/trustly-challenge-github-scraper-2020-12-17) | [![Deployed on Heroku](https://img.shields.io/badge/deployed%20on-heroku-purple)](https://trustly-github-scraper.herokuapp.com/) | [![DockerHub](https://img.shields.io/docker/image-size/adlerneves/trustly-challenge-github-scraper?label=docker%20image)](https://hub.docker.com/r/adlerneves/trustly-challenge-github-scraper) |
| [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=security_rating)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=security_rating)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) |
| [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=ncloc)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=sqale_index)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) |

The problem
-----------
As described in the "FIC Back-end Challenge.docx" document, the problem is scraping data from GitHub without using its API.

Observations
------------
Observing the page for IDs, I noticed that:
 - Pages that display code (or images, or raw data) contains ID "raw-url" on an A tag;
 - Pages that lists files contains ID "files" on a H2 tag;
 - No other page contains such IDs.

So, parsing XML and, then, querying those values might solve the problem.

Change of plans
---------------
My XML abstraction is way too non-performant for meeting the requirements. Back to the drawing board.

The approach from now on will treat the documents as plain text, and ID detection will be `id="raw-url"` and `id="files"`.

This will be necessary to achieve the "thousands of concurrent requests" requirement.