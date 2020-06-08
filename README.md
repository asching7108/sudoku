# Sudoku Web

Sudoku Web is a full stack web application for sudoku.

This is the client-side code for the application with React, Node.js and Vanilla CSS.

## Live

- [Live Page](https://sudoku-web.now.sh/)

## Server

- [Server Repo](https://github.com/asching7108/sudoku-server/)

## Set Up

- Clone this repository to your local machine: `git clone REPO-URL NEW-PROJECTS-NAME`
- cd into the cloned repository
- Make a fresh start of the git history for this project: `rm -rf .git && git init`
- Install dependencies: `npm install`
- Prepare environment file: `cp example.env .env`
- Replace values in `.env` with your custom values

## Scripts

- Start application `npm start`
- Run tests: `npm test`

## Deploy

Default deploying to Vercel. Replace name in `public/now.json` with your app name. When ready for deployment, run `npm run deploy`.

## Features

* Consists of 6 different levels of sudokus.
* Allows keeping memos of multiple numbers in each cell.
* Automatically highlights conflict cells.
* Allows undo and redo all steps.

## Technologies

* React
* Node.js
* JavaScript
* CSS
* Enzyme
