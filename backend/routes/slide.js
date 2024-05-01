const express=require("express")
const router = express.Router()
const controller = require("../controllers/slideController")

router.get("/slideData/:slideId",controller.getSlideById)
module.exports = router
