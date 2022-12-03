import sha256 from 'crypto-js/sha256';
import Jwt from 'jsonwebtoken';
import config from 'config';

const JWTKey: string = config.get('auth.JWTToken');

export function getCryptoPassword(password: string) {
  return sha256(password);
}

export function createJWTToken(id: number, username: string) {
  const payload = { sub: id, name: username, exp: Date.now() + 604800000 };

  return Jwt.sign(payload, JWTKey);
}
