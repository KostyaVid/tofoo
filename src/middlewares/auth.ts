import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import config from 'config';
import { User } from './../model/user';
import { AuthenticationError } from './../utils/error';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('auth.JWTToken'),
  ignoreExpiration: false,
  //issuer: 'accounts.examplesoft.com',
  //audience: 'yoursite.net',
};
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findUserByID(jwt_payload.sub);

      if (user) {
        return done(null, user);
      } else {
        throw new AuthenticationError('Wrong login or password');
      }
    } catch (err) {
      if (err instanceof AuthenticationError) return done(null, false);
      return done(err, false);
    }
  }),
);

export default passport;
