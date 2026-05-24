Server for spk-parfum — Express + Sequelize (MySQL)

Setup

1. Copy `.env.example` to `.env` and set your MySQL credentials.
2. Install dependencies from the `server` folder:

```bash
cd server
npm install
```

3. Seed the database (this will recreate tables):

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
```

The server listens on `PORT` (default 3000) and exposes endpoints used by the frontend (`/alternatif`, `/kriteria`, `/nilai`, `/hasil`).

If Docker is not available locally, use your installed MySQL server and set `server/.env` accordingly. The current `server/.env` defaults to local MySQL on port `3306` with `root` and no password.

Running with Docker

If you don't have MySQL installed locally you can use Docker-compose included at the repository root. From the project root:

```bash
docker compose up -d
cd server
npm install
npm run seed
npm run dev
```

Adminer will be available at http://localhost:8080 to inspect the database.
