import express from "express";
import { getAppDataSource, getScheduledSendMailService } from "./serviceProvider";
import { AppRoutes } from "./routes";
import { authorizationHandler } from "./middleware/authorizationHandler";
import { PORT } from "./config/config";

getAppDataSource()
  .initialize()
  .then(async () => {
    const app = express();
    app.use(express.json());

    AppRoutes.forEach((route) => {
      app[route.method](route.path, authorizationHandler(), ...route.handlers);
    });

    app.listen(PORT);

    console.log(`Mail Service is up and running on port ${PORT}`);

    getScheduledSendMailService().restart();
  })
  .catch((error) => console.log(error));
