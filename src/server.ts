import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/view";
import errorMiddleware from "./middlewares/errorMiddleware";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import sessionMiddleware from "./middlewares/session";
import passport from "passport";

const app = express();

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use("/", router);
app.use(errorMiddleware);

export default app;
