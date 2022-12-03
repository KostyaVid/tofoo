import {
  AuthenticationError,
  AuthorizationError,
  BaseError,
  EmailExistError,
  InvalidArgError,
  JWTLifeError,
  NotFoundError,
  ValidateError,
} from './error';

describe('Errors test', () => {
  it('Base Error', () => {
    const err = () => {
      throw new BaseError('test', 'testMassage');
    };
    expect(err).toThrow(new Error('testMassage'));
    expect(err).toThrow('test');
  });

  it('AuthenticationError', () => {
    const err = () => {
      throw new AuthenticationError('test');
    };
    expect(err).toThrow(new Error('test'));
  });

  it('EmailExistError', () => {
    const err = () => {
      throw new EmailExistError('test');
    };
    expect(err).toThrow(new Error('test'));
  });

  it('AuthorizationError', () => {
    const err = () => {
      throw new AuthorizationError('test');
    };
    expect(err).toThrow(new Error('test'));
  });

  it('NotFoundError', () => {
    const err = () => {
      throw new NotFoundError('test');
    };
    expect(err).toThrow(new Error('test'));
  });

  it('InvalidArgError', () => {
    const err = () => {
      throw new InvalidArgError('test');
    };
    expect(err).toThrow(new Error('test'));
  });

  it('ValidateError', () => {
    const err = () => {
      throw new ValidateError('test');
    };
    expect(err).toThrow(new Error('test'));
  });

  it('JWTLifeError', () => {
    const err = () => {
      throw new JWTLifeError('test');
    };
    expect(err).toThrow(new Error('test'));
  });
});
