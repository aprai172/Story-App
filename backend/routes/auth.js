const express=require("express")
const router = express.Router()
const controller = require("../controllers/authControllers")
const authChecker = require("../middlewares/authChecker")


router.post("/register",controller.register)
router.post("/login",controller.login)
router.post("/logout",controller.logout)
router.get("/validate",authChecker,controller.validate)

module.exports = router