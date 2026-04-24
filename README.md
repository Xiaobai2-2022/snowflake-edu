# Snowflake Educational System

A Granular Knowledge DAG Educational Platform

## Project Overview
This platform re-conceptualizes university engineering education by modeling curriculum as a Directed Acyclic Graph (DAG) of granular topics, rather than rigid, sequential 4-month courses. It is designed to solve the widening industry skills gap caused by curricular fragmentation and temporal discontinuity in traditional academic frameworks.

## Prerequisites

Before you begin, ensure you have met the following requirements:

1. Docker Compose

## Installation

To get a local copy up and running, follow these simple steps:

1. Clone the repo

```shell
git clone https://github.com/Xiaobai2-2022/snowflake-edu
```

2. Run Docker Compose

```shell
docker compose up --build
```

## Debug

### Debugging PGSQL

```shell
docker exec -it snowflake_db psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```

```postgresql
\dt
```
### Debugging Backend

Using link `http://localhost:8000/docs`
