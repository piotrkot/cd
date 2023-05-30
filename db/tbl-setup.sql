CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dishes
CREATE TABLE dishes (
  -- Identity
  id_i serial PRIMARY KEY,
  -- Name
  name_s text NOT NULL,
  -- Description
  desc_s text NOT NULL,
  -- Price in Euro
  price_n numeric NOT NULL CHECK (price_n > 0),
  -- Text search auto-sync vector
  tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', name_s || ' ' || desc_s)) STORED
);
CREATE INDEX tsv_idx ON dishes USING GIN (tsv);

-- Users
CREATE TABLE users (
  -- Identity
  id_i serial PRIMARY KEY,
  -- Username
  user_s text NOT NULL,
  -- Password
  passhash_s text NOT NULL
);

-- Ratings
CREATE TABLE ratings (
  -- Identity
  id_i serial PRIMARY KEY,
  -- Vote
  vote_i int NOT NULL CHECK (vote_i >= 1 AND vote_i <= 5),
  -- Dish identity
  dishid_i int NOT NULL REFERENCES dishes (id_i) ON DELETE CASCADE,
  -- user identity
  userid_i int NOT NULL REFERENCES users (id_i) ON DELETE CASCADE,
  -- Creation timestamp
  created_ts timestamptz NOT NULL DEFAULT NOW()
);

