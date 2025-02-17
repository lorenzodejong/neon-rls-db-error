# neon-rls-db-error

This is an example for [issue #144 on @neondatabase/serverless](https://github.com/neondatabase/serverless/issues/144).

The application throws a `error: NeonDbError: prepared statement "sX" does not exist` when performing multiple parallel DB requests.

## Prerequisite

You should have a JWKS endpoint running, for this example it doesn't really matter what JWKS endpoint we use.

Besides that you should have a valid access token which is signed with the keys from the JWKS endpoint.

## How to setup

### 1. Create a database in Neon

Enable RLS Authorize, this is where you provide the JWKS endpoint from the [pre-requisite]1(#prerequisite).

Apply the proposed queries under `Set up Extension and Roles Privileges`:

- Install the extension in the neondb database:
- Grant privileges to the roles in the neondb database:

### 2. Install the dependencies

```bash
pnpm install
```

### Set up the environment variables

You can copy the `.dev.vars.example` file to `.dev.vars` and modify the variables:

```bash
cp .dev.vars.example .dev.vars
```

Modify the following variables:

- `DATABASE_URL`: the pooling URL from Neon from the `neondb_owner` role
- `AUTHENTICATED_DATABASE_URL`: the pooling URL from Neon from the `authenticated` role
- `JWT_TOKEN`: a valid access token which is signed with the keys from the JWKS endpoint (see [pre-requisite](#prerequisite))

### Migrate the database

```bash
pnpm drizzle-kit migrate
```

### Run the development server

```bash
pnpm run dev
```

Now that the server is running, visit/request the `/` route: http://localhost:8787/.

Observed behavior:

- Some of the requests will fail with a `error: NeonDbError: prepared statement "sX" does not exist`
