import express from "express";
import { getAppDataSource } from "./serviceProvider";
import { AppRoutes } from "./routes";
import { authorization } from "./middleware/authorization";

const PORT = 8080;

getAppDataSource()
  .initialize()
  .then(async () => {
    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await AppDataSource.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await AppDataSource.manager.find(User);
    // console.log("Loaded users: ", users);

    const app = express();
    app.use(express.json());

    AppRoutes.forEach((route) => {
      app[route.method](route.path, authorization(), ...route.handlers);
    });

    app.listen(PORT);

    console.log(`Mail Service is up and running on port ${PORT}`);
  })
  .catch((error) => console.log(error));
