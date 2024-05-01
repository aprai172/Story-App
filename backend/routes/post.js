const express=require("express")
const router = express.Router()
const controller = require("../controllers/postControllers")
const authChecker = require("../middlewares/authChecker")


router.get("/postData/:id",controller.getPostDetailsById)
router.post("/addpost",authChecker,controller.createPost)
router.put("/edit/:id",authChecker,controller.editPost)
router.get("/:category",controller.getBYCategory)



module.exports = router