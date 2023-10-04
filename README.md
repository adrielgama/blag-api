
# Blag API

This is an [ExpressJS](https://expressjs.com/) REST API that uses [Prisma](https://www.prisma.io/) to connect to a Postgres database and CRUD blog.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/LqCw_O)

## ✨ Features

- Prisma
- Express
- Postgres
- TypeScript
- Cloudinary
- Jsonwebtoken
- Marked
- Node-cron

## 💁‍♀️ How to use

- Install dependencies `yarn`
- [Provision a Postgres container on Railway](https://dev.new)
- Connect to your Railway project with `railway link`
- Migrate the database `railway run yarn migrate:dev`
- Run the Server app `railway run yarn dev`

## 📝 Notes

This is a simple REST API for blog items. The available routes are

> ## Auth
- `POST /users/login` gets all todos *
- `POST /users/logout` creates a new using `text` in the JSON body *
- `POST /users/refresh-token` gets a todo by id *
  
#

> ## User
- `POST /users` login using text in the JSON body *
- `GET /users` gets all users
- `GET /users/:id` gets a user by id
- `PATCH /users/:id` updates a user by id
- `DELETE /users/:id` deletes a user by id

#

> ## Article
- `GET /articles:id` gets all articles *
- `GET /users/:userId/articles` gets all articles of a user by `userId`  *
- `POST /articles` create a new article using `text` in the JSON body (image attachment or image URL optional)
- `GET /articles/` gets all articles
- `PATCH /articles/:id` updates a articles by id
- `DELETE /articles/:id` deletes a articles by id


_`*` Don't require authentication on the route._ 