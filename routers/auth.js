const router = require("express").Router();

const { authControllers } = require("../controllers");


router.post("/login", authControllers.login);
router.post("/register", authControllers.register);
router.get("/keepLogin", authControllers.keepLogin);
router.get("/verification", authControllers.verification);


module.exports = router;
