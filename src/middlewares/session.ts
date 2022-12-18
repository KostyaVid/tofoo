import session from "express-session";
import passport from "passport";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import config from "config";
import logger from "./../utils/logger";
import { User } from "./../model/user";

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { ...user });
  });
});

passport.deserializeUser(function (user: User, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const sessionKey: string = config.get("auth.sessionKey");
const redisClient = createClient({ legacyMode: true });
redisClient.on("error", (err) => logger.error(err));
redisClient.connect().catch((err) => logger.error(err));
const RedisStore = connectRedis(session);

const sessionMiddleware = session({
  // eslint-disable-next-line
  store: new RedisStore({ client: redisClient as any, ttl: 3600000 }),
  secret: sessionKey,
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
});

export default sessionMiddleware;
