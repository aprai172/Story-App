const express=require("express")
const router = express.Router()
const controller = require("../controllers/userControllers")
const authChecker = require("../middlewares/authChecker")


router.post("/addbookmarks",authChecker,controller.createBookmark)
router.post("/removebookmarks",authChecker,controller.removeBookmark)
router.post("/likes",authChecker,controller.postLike)
router.post("/filterpost",authChecker,controller.filterPostsbyCategory)
router.get("/bookmarks",authChecker,controller.getAllBookMarks)
router.get("/bookmarks/:slideId",authChecker,controller.getBookMarksById)



module.exports = router