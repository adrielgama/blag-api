
# Blag API

This is an [ExpressJS](https://expressjs.com/) REST API that uses [Prisma](https://www.prisma.io/) to connect to a Postgres database and CRUD blog.

[![Deploy using Railway](https://railway.app/button.svg)](https://railway.app?referralCode=adrielgama)

## ✨ Features

- Prisma
- Express
- Postgres
- TypeScript
- Jsonwebtoken
- Marked
- Node-cron
- Radis

## 💁‍♀️ How to use

- Install dependencies `yarn`
- [Provision a Postgres container on Railway](https://railway.app?referralCode=adrielgama)
- Connect to your Railway project with `railway link`
- Migrate the database `railway run yarn migrate:dev`
- Run the Server app `railway run yarn dev`

## 📝 Notes

This is a simple REST API for blog items. The available routes are

> ## Auth
- `POST /users/login` Authenticate and log in a user *
- `POST /users/logout` Log out the current user *
- `POST /users/refresh-token` Refresh the authentication token *
  
#

> ## User
- `POST /users` Register a new user using the provided data in the JSON body *
- `GET /users` Get a list of all users
- `GET /users/:id` Get details of a user specified by the `id`
- `PATCH /users/:id` Update the details of a user specified by the `id`
- `DELETE /users/:id` Delete a user specified by the `id`

#

> ## Article
- `GET /articles:id` Get a specific article by its `id` *
- `GET /users/:userId/articles` Get all articles authored by a user specified by `userId`  *
- `POST /articles` Create a new article with the provided data in the JSON body. Optionally, attach an image or provide an image URL
- `GET /articles/` Get a list of all articles.
- `PATCH /articles/:id` Update the details of an article specified by the `id`
- `DELETE /articles/:id` Delete an article specified by the `id`


_`*` Don't require authentication on the route._ 