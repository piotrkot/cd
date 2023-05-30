
# Info

This is CD demo project.

# Setup

Create a local database in the docker container:
```
$> docker-compose up
$> psql -h localhost -p 5433 -U cduser -d cddb -f db/tbl-setup.sql
```

## Database access

Executing scripts on database:
```
$> psql -h localhost -p 5433 -U cduser -d cddb -f db/tbl-setup.sql
```

Logging to database:
```
$> psql -h localhost -p 5433 -U cduser -d cddb
```


# Testing

To test run the following command:
```
$> npm run test
```

# Running code analysis

To check the code run the following command:
```
$> npm run lint
```

# Running

To run the CD web application execute the following command:
```
$> node app.js
```

Environment variables are provided in `.env`.

# Available services

## Generate JWT token

`POST /authenticate`

Body parameters:

* `user` - User name in the DB,
* `pass` - User password in the DB.

Generate JWT token for existing DB user.

**Authentication**

There is a free access to the service.

**Result**

Service returns HTTP 200 OK with JWT token.

**Example**

*Request*

`$> curl -X POST http://localhost:3000/authenticate -d user="user" -d pass="pass"`

*Response*

`200 OK`
`"eyJhbGciOiJIUzI1NiIsIn"`

## Register new dish

`POST /dishes`

Body parameters:

* `name` - Name of the dish,
* `desc` - Description for the dish,
* `price` - Price of the dish.

Adds new dish.

**Authentication**

Access is secured with JWT token with the bearer authentication scheme in the Authorization HTTP header.

**Result**

Service returns HTTP 200 OK with body showing details of dish created.

**Example**

*Request*

`curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn" http://localhost:3000/dishes -d name="Fish" -d desc="Fish and chips" -d price="12.99"`

*Response*

`200 OK`
```json
[
  {
    "id":1,
    "name":"Fish",
    "desc":"Fish and chips",
    "price":12.99
  }
]
```

## Delete dish

`DELETE /dishes/<id>`

Deletes dish by `id`.

**Authentication**

Access is secured with JWT token with the bearer authentication scheme in the Authorization HTTP header.

**Result**

Service returns HTTP 200 OK with body containing `id` of the deleted entry.

**Example**

*Request*

`curl -X DELETE -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn" http://localhost:3000/dishes/1`

*Response*

`200 OK`
```json
[
  {
    "id": 1
  }
]
```

## Update dish

`PUT /dishes/<id>`

Body parameters:

* `name` - Name of the dish,
* `desc` - Description for the dish,
* `price` - Price of the dish.

Updates dish with given `id`.

**Authentication**

Access is secured with JWT token with the bearer authentication scheme in the Authorization HTTP header.

**Result**

Service returns HTTP 200 OK with body containing the updated dish.

**Example**

*Request*

`curl -X PUT -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn" http://localhost:3000/dishes/1 -d name="Fish" -d desc="Fish and chips with cola" -d price="14.99"`

*Response*

`200 OK`
```json
[
  {
    "id":1,
    "name":"Fish",
    "desc":"Fish and chips with cola",
    "price":14.99
  }
]
```

## Show dishes

`GET /dishes?query=<query>&min=<min>&max=<max>`

where

* `query` - is a query string that matches dishes name or description
* `min` - is the minimum price of the dish
* `max` - is the maximum price of the dish

All query string parameters are optional.

Lists dishes that match query, min, and max price values. Ordered by query match relevance.
When query string parameters are missing, all dishes are returned. 

**Authentication**

Access is secured with JWT token with the bearer authentication scheme in the Authorization HTTP header.

**Result**

Service returns HTTP 200 OK with body containing dishes.

**Example**

*Request*

`curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn" http://localhost:3000/dishes?query=fish&min=10.00`

*Response*

`200 OK`
```json
[
  {
    "id": 1,
    "name":"Fish",
    "desc":"Fish and chips with cola",
    "price":14.99
  }
]
```

## Add rating

`POST /ratings/<dish>`

where

* `dish` - is the identity of the dish.

Body parameters:

* `vote` - Vote (number between 1 and 5, including).

Adds a rating for given dish with given value by requesting user.

**Authentication**

Access is secured with JWT token with the bearer authentication scheme in the Authorization HTTP header.

**Result**

Service returns HTTP 200 OK with body containing the given rating.

**Example**

*Request*

`curl -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn" http://localhost:3000/ratings/1 -d vote=4`

*Response*

`200 OK`
```json
[
  {
    "vote": 4,
    "dish": 1
  }
]
```

## Show ratings

`GET /ratings`

Shows average ratings for all dishes.

**Authentication**

Access is secured with JWT token with the bearer authentication scheme in the Authorization HTTP header.

**Result**

Service returns HTTP 200 OK with body containing ratings.

**Example**

*Request*

`curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn" http://localhost:3000/ratings`

*Response*

`200 OK`
```json
[
  {
    "votes": 4.5,
    "dish": 1
  }
]
```

