# ClassCompass Infrastructure

This repository contains the infrastructure configuration for ClassCompass, managed via Docker Compose.

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

### 1. Getting Started

Open a terminal and run the following commands:

```bash
git clone https://github.com/shestakov-dev/ClassCompassInfrastructure
cd ClassCompassInfrastructure
```

### 2. Environment Variables Configuration

Copy all files ending with `.example` in the `config/env/` directory, removing the `.example` suffix (e.g., `kratos.env.example` becomes `kratos.env`). Then open each file and edit the values according to your requirements.

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

### 3. Redis ACL Configuration

Copy the file `config/databases/redis/users.acl.example` and rename it to `users.acl`. Open it and replace `<YOUR_USERNAME>` and `<YOUR_PASSWORD>` with your values.

```bash
cd config/databases/redis
cp users.acl.example users.acl
```

Edit `users.acl` to set your Redis username and password:

```text
user <YOUR_USERNAME> on ><YOUR_PASSWORD> ~* +@all
```

### 4. Generate Oathkeeper JWKS

Oathkeeper requires a JWK file used for signing request data passed through the proxy. Run the following command from the repository root to generate it:

```bash
docker run --rm oryd/oathkeeper:v25.4.0 credentials generate --alg RS256 > config/ory/oathkeeper/jwks.json
```

### 5. Configure Oathkeeper Rules

Oathkeeper uses rules to determine which requests are forwarded to which service. If you're using a domain other than `classcompass.shestakov.app` (the default), you need to edit the rules file in addition to the environment variables. In `config/ory/oathkeeper/rules.yml`, replace all occurrences of the domain with your new one.

### 6. Running the Application

The final step is to start the application:

```bash
docker compose up -d
```

This command will start all required containers for the application and monitor for new versions of the server and client images. When new versions are detected, they will be automatically pulled and started.
