# Crawler Tools

## Install Yarn and Sequelize-cli

```bash
[sudo] npm install yarn sequelize-cli -g
```

## Clone project

```bash
git clone https://github.com/DoraMatching/crawler-tools.git
```

## Install dependencies

```bash
cd crawler-tools
yarn install
```

## Migration

```bash
yarn db:migrate
```

OR - remove old DB and re-migrate

```bash
yarn db:new # this command will remove developement.db file & migrate DB !
```

## Start crawling data

```bash
yarn start
```