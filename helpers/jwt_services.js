const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../helpers/connections_redis");
/**
 * Generates an access token for the given user ID.
 *
 * @param {string} userId - The ID of the user.
 * @return {Promise<string>} A promise that resolves to the access token.
 */
const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };

    jwt.sign(payload, secret, options, function (err, token) {
      if (err) reject(err);
      resolve(token);
    });
  });
};
/**
 * Generates a signed refresh token for the given user ID.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<string>} A promise that resolves to the signed refresh token.
 */
const signRefreshToken = async (userId) => {
  // year is 365 * 24 * 60 * 60 * 60 (in seconds)
  const YEAR = 365 * 24 * 60 * 60 * 60;
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };

    const secret = process.env.REFRESH_TOKEN_SECRET;

    jwt.sign(payload, secret, function (err, token) {
      if (err) reject(err);

      client.set(userId.toString(), token, {
        EX: YEAR,
        NX: true,
      });
      resolve(token);
    });
  });
};

const verifyAccessToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!authorization) {
    return next(createError.Unauthorized());
  }

  const accessToken = authorization.split(" ")[1];

  jwt.verify(accessToken, secret, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      }
      return next(err);
    }

    req.payload = payload;
    next();
  });
};

const verifyRefreshToken = async (refreshToken) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret, function (err, payload) {
      if (err) return reject(err);
      client.get(payload.userId.toString(), (err, rely) => {
        if (err) return reject(createError.InternalServerError(err));
        if (refreshToken !== rely) {
          return reject(createError.Unauthorized());
        }
      });
      resolve(payload);
    });
  });
};
module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
