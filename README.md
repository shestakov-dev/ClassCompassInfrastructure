# ClassCompass Infrastructure

This repository contains the infrastructure configuration for ClassCompass, managed via Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuration

### 1. Environment Variables

Navigate to the `config/env/` directory and create copies of all `.example` files, removing the `.example` extension. Then, open each new `.env` file and update the values according to your environment.

```bash
cd config/env
cp app-postgres.env.example app-postgres.env
cp keto.env.example keto.env
cp kratos.env.example kratos.env
cp ory-postgres.env.example ory-postgres.env
cp server.env.example server.env
# Edit the files with your preferred editor
nano app-postgres.env # etc...
```

### 2. Redis Configuration

Navigate to `config/databases/redis/` and create a copy of `users.acl.example` named `users.acl`.

```bash
cd ../../databases/redis
cp users.acl.example users.acl
```

Edit `users.acl` to set your Redis username and password:

```text
user <YOUR_USERNAME> on ><YOUR_PASSWORD> ~* +@all
```

## Initialization

### Generate Oathkeeper JWKS

Before running the application, you must generate the JSON Web Key Set (JWKS) for Ory Oathkeeper. Run the following command from the root of the repository:

```bash
docker run --rm oryd/oathkeeper:v25.4.0 credentials generate --alg RS256 > config/ory/oathkeeper/jwks.json
```

## Running the Application

Start the entire stack using Docker Compose:

```bash
docker compose up -d
```
