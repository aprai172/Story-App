const User = require("../models/users");
const Post = require("../models/post");
const Slide = require("../models/slide");


const createBookmark = async (req, res, next) => {
  try {
    const { slideId } = req.body;
    const userId = req.user;
    if (!userId || !slideId) {
      return res.status(400).json({ error: "userId and slideId are empty" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not exist" });
    }
    user.bookmarks.push(slideId);
    await user.save();
    res.status(200).json({ message: "Bookemark Successfully Added" });
  } catch (error) {
    next(error);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const { slideId } = req.body;
    const userId = req.user;
    if (!userId || !slideId) {
      return res.status(400).json({ error: "userId and slideId are empty" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not exist" });
    }
    user.bookmarks = user.bookmarks.filter(
      (bookmarks) => bookmarks.toString() !== slideId
    );
    await user.save();
    res.status(200).json({ message: "Bookemark Successfully removed" });
  } catch (error) {
    next(error);
  }
};

const postLike = async (req, res, next) => {
  try {
    const { slideId } = req.body;
    const userId = req.user;
    if (!userId || !slideId) {
      return res.status(400).json({ error: "userId and slideId are empty" });
    }
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ error: "Slide not found" });
    }
    if (slide.likes.includes(userId)) {
      slide.likes = slide.likes.filter((like) => like.toString() !== userId);
      await slide.save();
      return res.status(200).json({
        message:"Slide unliked Successfully",
        likeCount:slide.likes.length,
        likeStatus:false
      })
      
    }
    slide.likes.push(userId)
      await slide.save()
      res.status(200).json({
        message: "Slide liked successfully",
        likeCount: slide.likes.length,
        likeStatus: true,
      })
  } catch (error) {
    next(error);
  }
};

const filterPostsbyCategory = async (req,res,next)=>{
  const { filters } = req.body;
  try {
    const userId = req.user;
    let filteredPosts;
    if (!filters || !Array.isArray(filters)) {
      return res.status(400).json({ error: "Invalid filters format" });
    }
    if (filters.includes("All")) {
      filteredPosts = await Post.find({ postBy: userId }).populate({
        path: "slides",
        match: {},
      });
    } else {
      filteredPosts = await Post.find({ postBy: userId }).populate({
        path: "slides",
        match: { category: { $in: filters } },
      });
    }
    filteredPosts = filteredPosts.filter((post) => post.slides.length > 0);
    res.status(200).json({ posts: filteredPosts });
  } catch (error) {
    next(error);
  }
};


const getAllBookMarks=async(req,res,next)=>{
    try{
        const userId = req.user
        const user = await User.findById(userId).populate("bookmarks");
        if(!user){
            return res.status(404).json({error:"User not exists"})
        }
        const bookmarks = user.bookmarks.map((bookmark)=>{
            const slide = bookmark;
            return{
                slides:[slide],
            }
        })
        res.status(200).json({bookmarks})
    }catch(error){
        next(error)
    }
}

const getBookMarksById = async (req,res,next)=>{
    try{
        const {slideId}=req.params
        const userId = req.user
        if(!userId || !slideId){
            return res.status(400).json({ error: "userId and slideId are empty" });
        }
        const user  = await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"USER NOT EXISTS"})
        }
        const isBookmarked = user.bookmarks.includes(slideId)
        res.status(200).json({isBookmarked})
    }catch(error){
        next(error)
    }
}

module.exports ={createBookmark,removeBookmark,postLike,filterPostsbyCategory,getAllBookMarks,getBookMarksById}