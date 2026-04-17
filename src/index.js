import express from "express";

import morgan from "morgan";
import cors from "cors";

import {PORT} from "./config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/users.routes.js";

const app = express();

// settings
//app.set("port", process.env.PORT || 3000);

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({exteded: false}));
app.use(express.json());
app.use(errorHandler);

app.use(userRoutes);


// starting the server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});