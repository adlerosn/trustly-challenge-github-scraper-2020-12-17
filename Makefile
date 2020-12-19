test: lint
	node node_modules/mocha/bin/mocha test.js

lint: node_modules
	node node_modules/eslint/bin/eslint.js src

build_dockerfile:
	docker build --tag adlerneves/trustly-challenge-github-scraper:${PKG_VER} .

node_modules:
	npm install --also=dev
