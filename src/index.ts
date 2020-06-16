import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";
import * as helmet from "helmet";
import * as cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import * as http from "http";

// create express app
const app = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//Set all routes from routes folder
app.use("/", routes);
// register all application routes
app.use(errorHandler);

http.createServer(app).listen(3000, () => {
  console.log("Express application is up and running on port 3000");
});
