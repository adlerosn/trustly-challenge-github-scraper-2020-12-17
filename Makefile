test: lint
	node node_modules/mocha/bin/mocha test.js -j 1 -slow 1 --describe-duration
	node node_modules/mocha/bin/mocha testIntegration.js --timeout 600000 -j 1 -slow 1

lint: node_modules
	node node_modules/eslint/bin/eslint.js src

build_dockerfile:
	docker build --tag adlerneves/trustly-challenge-github-scraper:${PKG_VER} .

node_modules:
	npm install --also=dev
