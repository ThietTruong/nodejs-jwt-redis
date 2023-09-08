const UserModel = require("../models/user.model");
const createError = require("http-errors");
const userValidate = require("../helpers/validation");
const client = require("../helpers/connections_redis");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_services");
module.exports = {
register: async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userValidate(req.body);

    if (error) {
      throw createError.BadRequest(error.details[0].message);
    }

    const isEmailRegistered = await UserModel.findOne({ email });

    if (isEmailRegistered) {
      throw createError.Conflict(`Email ${email} has already been registered`);
    }

    const user = new UserModel({ email, password });
    await user.save();

    return res.json({
      status: "success",
      elements: user,
    });
  } catch (error) {
    next(error)}
},
login: async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = userValidate(req.body);

  try {
    if (error) {
      throw createError.BadRequest(error.details[0].message);
    }
    const user = await UserModel.findOne({ email });

    if (!user) throw createError.NotFound(`Email ${email} is not found`);

    const isCheckPassword = await user.isCheckPassword(password);

    if (!isCheckPassword) {
      throw createError.BadRequest();
    }

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    res.json({
      status: "success",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
},
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const payload = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(payload.userId);
      const newRefreshToken = await signRefreshToken(payload.userId);
      res.json({
        status: "success",
        id: payload.id,
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) throw createError.BadRequest();

      const { userId } = await verifyRefreshToken(refreshToken);
      const resDel = await client.del(userId.toString());

      if (resDel === 0) {
        throw createError.InternalServerError();
      }

      if (resDel === 1) {
        return res.json({
          status: "Logout success",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  list: (req, res) => {
    const fakeGmailList = [
      {
        id: 1,
        email: "JXGdY@example.com",
      },
      {
        id: 2,
        email: "JXGdY@example.com",
      },
      {
        id: 3,
        email: "JXGdY@example.com",
      },
    ];

    return res.json({
      fakeGmailList,
    });
  },
};
