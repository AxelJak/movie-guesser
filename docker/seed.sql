CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;

CREATE TABLE "room" (
  "id" VARCHAR PRIMARY KEY,
  "room_key" VARCHAR NOT NULL
);
CREATE TABLE "player" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "score" INTEGER NOT NULL,
  "roomID" VARCHAR NOT NULL REFERENCES "room"(id)
);

CREATE TABLE "settings" (
  "id" VARCHAR PRIMARY KEY,
  "rounds" INTEGER NOT NULL,
  "time" INTEGER NOT NULL,
  "players" INTEGER NOT NULL,
  "roomID" VARCHAR NOT NULL REFERENCES "room"(id)
);

CREATE TABLE "round" (
  "id" VARCHAR PRIMARY KEY,
  "round" INTEGER NOT NULL,
  "playerID" VARCHAR REFERENCES "player"(id),
  "roomID" VARCHAR REFERENCES "room"(id),
  "timestamp" TIMESTAMP NOT NULL,
  "movie" VARCHAR NOT NULL
);

CREATE TABLE "guess" (
  "id" VARCHAR PRIMARY KEY,
  "senderID" VARCHAR REFERENCES "player"(id),
  "roomID" VARCHAR REFERENCES "room"(id),
  "guess" VARCHAR NOT NULL,
  "timestamp" TIMESTAMP NOT NULL
);

CREATE TABLE "game_state" (
  "id" VARCHAR PRIMARY KEY,
  "roomID" VARCHAR NOT NULL REFERENCES "room"(id),
  "current_round" INTEGER NOT NULL,
  "current_player_explaining" VARCHAR REFERENCES "player"(id),
  "game_status" VARCHAR NOT NULL, -- e.g., 'waiting', 'in_progress', 'finished'
  "started_at" TIMESTAMP,
  "ended_at" TIMESTAMP
);

CREATE TABLE "movie" (
  "id" VARCHAR PRIMARY KEY,
  "title" VARCHAR NOT NULL,
  "overview" VARCHAR NOT NULL,
  "poster_path" VARCHAR NOT NULL,
  "backdrop_path" VARCHAR NOT NULL,
  "release_date" VARCHAR NOT NULL,
  "vote_average" DOUBLE PRECISION NOT NULL,
  "vote_count" INTEGER NOT NULL
);

CREATE TABLE "list" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL
);

CREATE TABLE "movie_list" (
  "movie_id" VARCHAR REFERENCES "movie"(id),
  "list_id" VARCHAR REFERENCES "list"(id),
  PRIMARY KEY ("movie_id", "list_id")
);