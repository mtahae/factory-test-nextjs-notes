# Fieldnote

A small notes app for capturing meeting notes, tagging them, and finding them
again later. Built with Next.js (App Router).

## Features

- Write a note with a title, body and comma-separated tags
- Search notes by title or body text
- Pin important notes so they stay at the top of the list
- Delete notes you no longer need

## Running locally

```bash
npm install
npm run dev
```

The app runs on <http://localhost:3000>.

## API

| Method   | Path              | Description                                  |
| -------- | ----------------- | -------------------------------------------- |
| `GET`    | `/api/notes`      | List notes. Supports `?q=` and `?tag=`        |
| `POST`   | `/api/notes`      | Create a note (`title`, `content`, `tags[]`)  |
| `GET`    | `/api/notes/:id`  | Fetch a single note                           |
| `PATCH`  | `/api/notes/:id`  | Update `title`, `content` or `pinned`         |
| `DELETE` | `/api/notes/:id`  | Delete a note                                 |

## Storage

Notes live in memory (`lib/store.js`) and reset when the server restarts.
Postgres is planned before the first real deployment.
