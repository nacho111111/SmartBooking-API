import express from "express";
import cookieParser from "cookie-parser"
import { createServer } from 'http'; // Módulo nativo
import { Server } from "socket.io"

import morgan from "morgan";
import cors from "cors";

import { PORT } from "./config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/users.routes.js";
import { startDailyTasks } from "./task/dailyReport.js";

const app = express();
const server = createServer(app);
startDailyTasks();

const whitelist = [
  process.env.FRONTEND_URL, 
  'https://cal.com',        
  'https://app.cal.com']
  
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas de CORS'));
    }
  },
  credentials: true
};

// middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.set('trust proxy', 1);
app.use(express.urlencoded({extended: false}));
app.use(morgan("dev"));

const io = new Server(server, {cors: corsOptions});

app.use((req, res, next) => {
  req.io = io;
  next();
});
//routes
app.use(userRoutes);
app.use(errorHandler);
//starting the server
io.on("connection", (socket) => {
  console.log("Usuario conectado al socket");
});

server.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});