const router = require("express").Router();

const { authControllers } = require("../controllers");
const {adminControllers} = require ("../controllers")

router.post("/login", authControllers.login);
router.post("/register", authControllers.register);
router.get("/keepLogin", authControllers.keepLogin);
router.get("/verification/:token", authControllers.verification)


// router.post("/registerAdmin", adminControllers.registerAdmin)
router.post("/loginAdmin", adminControllers.loginAdmin);
router.get("/keepLoginAdmin", adminControllers.keepLoginAdmin);

module.exports = router;
