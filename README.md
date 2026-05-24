# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Running the frontend with the real backend

The frontend is configured to talk to `http://localhost:3000` via `src/services/api.js`. To run the React app together with the backend server, use:

```bash
cd server
npm install
npm run seed
npm run dev
```

In another terminal, run:

```bash
cd ..
npm run dev
```

Or from the root project folder, if the server dependencies are already installed:

```bash
npm run dev:all
```

If you want to use the old JSON-server mock instead, use:

```bash
npm run json-server
```

## Deployment

### Docker Compose

1. Copy environment variables if needed:
   ```bash
   cp .env.example .env
   ```
2. Build and start the app:
   ```bash
docker compose up --build
   ```
3. Open the app at `http://localhost:3000` and Adminer at `http://localhost:8080`.

### Manual production run

1. Install root dependencies and build the frontend:
   ```bash
   npm install
   npm run build
   ```
2. Install server dependencies and start the backend:
   ```bash
   cd server
   npm install
   npm start
   ```

The backend serves the production frontend build from `dist` and exposes the API on the same port.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
