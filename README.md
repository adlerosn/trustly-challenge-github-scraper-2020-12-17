Trustly challenge: GitHub scraper
=================================

Ádler Oliveira Silva Neves's solution.

| | | |
|:---:|:---:|:---:|
| [![TravisCI](https://api.travis-ci.com/adlerosn/trustly-challenge-github-scraper-2020-12-17.svg?branch=master)](https://travis-ci.com/github/adlerosn/trustly-challenge-github-scraper-2020-12-17) | [![Deployed on Heroku](https://img.shields.io/badge/deployed%20on-heroku-purple)](https://trustly-github-scraper.herokuapp.com/) | [![DockerHub Repository](https://img.shields.io/docker/image-size/adlerneves/trustly-challenge-github-scraper?label=docker%20image)](https://hub.docker.com/r/adlerneves/trustly-challenge-github-scraper) |
| [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=security_rating)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=security_rating)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) |
| [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=ncloc)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=sqale_index)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) | [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=trustly-challenge-github-scraper&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=trustly-challenge-github-scraper) |

Section written before implementing
===================================

The problem
-----------
As described in the "FIC Back-end Challenge.docx" document, the problem is scraping data from GitHub without using its API.

It was requested that:
 1. [Must] Implementation in Java 8+, ES6+ or C# 8.0;
 2. [Must] Retrieve data from scraping web GitHub HTML;
 3. [MustNot] Retrieve data from scraping web GitHub API;
 4. [MustNot] Use web scraping libraries;
 5. [Must] Support thousands of concurrent requests;
 6. [Should] Reply quickly after re-querying a repository;
 7. [ShouldNot] Timeout the request;
 8. [Must] Be inteligible code and API design;
 9. [Desirable] SOLID principles;
 10. [Desirable] Interoperability;
 11. [Optional] Data persistance;
 12. [Must] 1+ automated tests;
 13. [Must] Deploy to cloud (AWS or Heroku).

The requirements #1-#4 are straightforward and don't demand further thinking. I'll go with ES6+.

Testing the requirement #5 is met before submitting, with the requirement #13 in mind is a challenge; even more with relatively slow internet speeds - I hope that getting at least 3 thousand requests per second on ApacheBench on my local machine suffices.

Requirement #6 implies into some sort of caching. The requirement #11 makes persistence optional. Therefore, I guess this is a purposefully misleading hint for deploying some sort of in-memory caching. Requirement #7 seems to be a continuation of it.

Requirement #8 can be easily be met by using Clean Code principles. The hard part is that it's way easier and perceived as quicker to write spaghetti code, which requirement #9 confirms.

Requirement #10 is tricky because the external system might not only require Cross-Origin Resource Sharing to be enabled, but also is vague enough to not know which technologies the other systems are already compatible with.

Requirement #12 would be harder if a minimum code coverage percentage was a requirement.

Development Environment
-----------------------
 - Arch Linux
 - i7-4790@3.6GHz
 - 16GB DDR3@1600Mhz
 - Visual Studio Code
 - Node.JS v15.4.0
 - ISP bandwidth: 35 mbps (4.375 MB/s)
 - Latency to GitHub from home:
    ```
    $ httping https://github.com/adlerosn/easy-mail-cfg
    [...]
    26 connects, 26 ok, 0.00% failed, time 38237ms
    round-trip min/avg/max = 448.3/483.4/608.1 ms
    ```
   I'm aware that this is the Latency to GitHub from Canada:
    ```
    $ httping https://github.com/adlerosn/easy-mail-cfg
    [...]
    26 connects, 26 ok, 0.00% failed, time 26801ms
    round-trip min/avg/max = 48.9/52.5/54.9 ms
    ```
   I expect some minor behavioral changes to the app, such as getting 429 errors more often.

Addressing the problem of parsing web pages
-------------------------------------------
Observing the page for IDs, I noticed that:
 - Pages that display code (or images, or raw data) contains ID "raw-url" on an A tag;
 - Pages that lists files contains ID "files" on a H2 tag;
 - No other page contains such IDs.

So, parsing XML and, then, querying those values might solve the problem.

### Change of plans
My XML abstraction was, by far, too slow for meeting the requirement #5 (thousands of concurrent requests).
Back to the "drawing board" stage, I think the problem can and should be solved treating the returned HTML as a huge string.
The ID detection can still be done by checking the presence of `id="raw-url"` and `id="files"` strings.
There are basically two toolsets for this on this approach: Regular Expressions and splits/indexOfs/etc.

#### On Regular Expressions versus `.split(), .trim(), etc`
It's fairly easy to write non-performant Regular Expressions and not notice why it's slow. On a 1.5MB file (see `test_assets/repo_listing_hugelimit.html`), it can be disastrous.

Retaining to other tools that have their performance more predictable isn't the ideal because writing the equivalent as a Regular Expression can become a hurdle to comprehension on how to retrieve formatted text.

Believeing that each tool has its space, I'll use `.split(), .trim(), slice, etc` on larger blocks of text and Regular Expressions to retrieve a somewhat structured data from smaller chunks of text.

I believe this will suffice to achieve the requirement #5 (thousands of concurrent requests).

Section written after implementing
==================================
After implementing, there are some things that are worth commenting:

The API:
--------
The URL follows the format "`https://trustly-github-scraper.herokuapp.com/{returnFormat}/{user}/{repository}`":
 - returnFormat:
   - json
   - xml
   - yml
   - yaml

Let's say you want information about the repository "`https://github.com/ppy/osu`" in YAML.
You just need to identify that "`ppy`" is the "`user`", "`osu`" is the "`repository`" and "`yaml`" is the "`format`". Them, you build the URL:

`https://trustly-github-scraper.herokuapp.com/yaml/ppy/osu`

That's it.

Addressing Caching
------------------
Caching could be persisted, but a simple transient object holder that starts with the NodeJs process and finishes with the NodeJs process was the easiest minimal-effort path.
As advantage, the docker image did not need any updates.

Addressing Interoperability
---------------------------
Interoperability usually is achieved by allowing Cross-Origin Resource Sharing. However, some systems goes a step further and offer more than one serialization technology. I've built XML and YAML as alternatives to JSON, as a way to make it easier for other systems to import data from this one.

Measuring Concurrency
---------------------
I ran cURL twice, then ApacheBench on `http://localhost:8000/json/adlerosn/easy-mail-cfg`.
The exact commands are as follows:

```sh
time sh -c 'curl http://localhost:8000/json/adlerosn/easy-mail-cfg | jq'
time sh -c 'curl http://localhost:8000/json/adlerosn/easy-mail-cfg | jq'
ab -n 100000 -c 1020 'http://localhost:8000/json/adlerosn/easy-mail-cfg'
```

- The initial cURL took 9.556s.
- The second cURL took 0.031s.
- Firing 100k requests on 1020 concurrent threads renders this report:

```
This is ApacheBench, Version 2.3 <$Revision: 1879490 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            8000

Document Path:          /json/adlerosn/easy-mail-cfg
Document Length:        2777 bytes

Concurrency Level:      1020
Time taken for tests:   25.118 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      299600000 bytes
HTML transferred:       277700000 bytes
Requests per second:    3981.14 [#/sec] (mean)
Time per request:       256.208 [ms] (mean)
Time per request:       0.251 [ms] (mean, across all concurrent requests)
Transfer rate:          11647.94 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   25 141.0      4    1033
Processing:    18  230  36.8    236     462
Waiting:        1  174  46.2    184     315
Total:         18  255 150.2    240    1464

Percentage of the requests served within a certain time (ms)
  50%    240
  66%    251
  75%    256
  80%    260
  90%    270
  95%    295
  98%    321
  99%   1280
 100%   1464 (longest request)
```

Increasing the number of concurrent threads by 1 (to 1021) prints the error "`socket: Too many open files (24)`" to the terminal window and the benchmark doesn't run.

As serving 3981.14 requests per second is 32.7% greater than my initial 3000 goal, I'm happy with it for now.

Achieving Clean Code
--------------------
By using linters (ESLint and SonarQube) that enforce codestyle and some good practices, I believe I wrote a better code than if I didn't use any.

Unit and Integration Testing
----------------------------
After Cucumber (a tool for Behavior Driven Development) refused to work with my project, I've set Mocha up and implemented way more than one test case.

They've demonstrated to be, yet again, really useful against self-confidence, proving incorrect code that was believed to run without any issues.

Also, as I'm already doing unit tests, why not test how the code integrates with the upstream data source for its read-only operations? That's how Integration Testing got into the continuous integration pipeline.

Environment Variables
---------------------
The NodeJs process listens to some environment variables. They are:
 - PORT: defaults to `8000`: The port number Node.JS will bind to.
 - DEFAULT_HTTP_DOWNLOADER: defaults to `got` (others: `axios`): Allows you to change the HTTP downloader library (and download everything 15% slower).
 - REQUEST_MAX_DOWNLOAD_CONNECTIONS: defaults to `1`: The number of concurrent connections each request can make to GitHub.
 - GITHUB_PAGE_CACHE_MAX_SIZE: defaults to `25000`: The number of pages to keep cached in memory.
 - GITHUB_FINAL_RESULT_CACHE_MAX_SIZE: defaults to `200`: The number of downloadable reports to keep cached in memory.

Beyond the Requirements
-----------------------
On GitHub, "`https://github.com/ppy/osu/tree/master/osu.Game.Rulesets.Osu`" describes a folder. It's possible to get its report by acessing "`https://trustly-github-scraper.herokuapp.com/json/ppy/osu/tree/master/osu.Game.Rulesets.Osu`".

Caveats and Attention Points
----------------------------
 - [Some repositories](https://github.com/adlerosn/mininet-n-ryu-routing-algorithm-comparator/tree/master/resultcache) have folders with more than 1000 files. As GitHub doesn't display them in any way, those files won't be counted.
 - [Some repositories](https://github.com/thp/psmoveapi/tree/master/external) have submodules. They're not part of a project, but a reference to another project that isn't resolved by default by the repository cloning operation. With this understanding, they'll be ignored.
 - Understanding that files like "MOVIE0000.3GP" or "MyVacations.3gp" have file type, they'll be treated as their lowercase form; the same applies to all other extensions.
 - Unix way of providing hidden files (.filename) doesn't mean its extension starts at the 2nd character of the name. All extensions are measured by 
 - Files with multiple chained extensions (such as "`.tar.gz`") gets only its last extension in the extension list.
 - `null` cannot be an object key on popular serialization methods (such as JSON); as a way of circumventing this limitation, "`noExtension/`" was used as the string key used to represent files without any extension (as `/` is a reserved character for paths, it won't ).
 - Receiving a 429 from GitHub will abort the current scraping. However, individual page will still be cached and, thus, a new request might resume.
 - A request might timeout if Heroku infrastructure decides the request is taking too long to complete. This will only happen while the cache isn't populated fully; after the first successful attempt, further requests should not timeout.
 - If a repository is *way too large*, increasing cache size might be needed.

Possible Improvements
---------------------
 - Explicitly specializing more `object`s on the service package;
 - Add a 2nd (on-database) persisting cache layer;
 - Deal with 429 errors gracefully (wait);
 - Doing a master queue for processing all requests from all clients without getting an 429 error;
 - A better UI than a raw JSON fille telling the user to manipulate the address bar - maybe Swagger?

This isn't, by any means, an exhaustive list.

Final Considerations
--------------------
This was a really good challenge; not because it's hard, but because it brings a clean slate and asks our opinions on how a well thought-out system should work and how a well-written codebase should look like.

I hope to have met your expectations.

Thank you.
