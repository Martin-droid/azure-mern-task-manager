# MERN Task Manager

A production-oriented task manager built with MongoDB, Express, React, and Node.js. The repository is structured for local development and deployment to Microsoft Azure App Service.

## Features

- Create, list, update, and delete tasks.
- Validate task input at the API boundary.
- Store production data in MongoDB through Mongoose.
- Serve the built React application from Express in production.
- Expose a health endpoint for Azure monitoring.
- Use environment variables for the database connection and runtime configuration.
- Test API behavior through an injected in-memory repository.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   npm --prefix client install
   ```

2. Copy the example environment file and provide a MongoDB connection string:

   ```bash
   cp .env.example .env
   ```

3. Start the API and React development servers:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` and the React development server runs on `http://localhost:5173`.

## Verification

```bash
npm test
npm run build
```

## Azure deployment

1. Create a MongoDB Atlas cluster and allow the Azure Web App to reach it.
2. Create an Azure Linux Web App using a current Node.js runtime.
3. Configure these App Service environment variables:

   - `MONGODB_URI`: MongoDB Atlas connection string.
   - `NODE_ENV`: `production`.
   - `PORT`: supplied automatically by Azure.

4. Connect the repository in Azure Deployment Center.
5. Use `npm run build` as the build command and `npm start` as the startup command.
6. Verify `/api/health`, then exercise task creation, editing, completion, and deletion in the deployed interface.

Never commit real credentials. Azure and MongoDB secrets belong in their respective environment-variable settings.
