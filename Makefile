lint: node_modules
	node node_modules/eslint/bin/eslint.js src

test: lint
	@echo -ne

build_dockerfile:
	docker build --tag adlerneves/trustly-challenge-github-scraper:${PKG_VER} .

node_modules:
	npm install --also=dev
