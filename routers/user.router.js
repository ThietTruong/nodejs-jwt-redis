const express = require("express");
const router = express.Router();

const {register,  login, refreshToken , logout, list} = require("../controllers/user.controller");
const {
  verifyAccessToken,
} = require("../helpers/jwt_services");
router.post("/register",register );

router.post("/refresh-token", refreshToken);

router.post("/login", login);

router.delete("/logout", logout);

router.get("/list", verifyAccessToken, list );
module.exports = router;
