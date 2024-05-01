const Post = require("../models/post");
const Slide = require("../models/slide");
const User = require("../models/users");

const getPostDetailsById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existingPost = await Post.findById(id).populate("slides");
    res.status(200).send(existingPost);
  } catch (error) {
    next(error);
  }
};
const createPost = async (req, res, next) => {
  const { slides } = req.body;
  try {
    const userId = req.user;
    console.log(userId)
    const user = await User.findById(userId);
    


    const slideObj = slides.map((slideDetail, index) => {
      return new Slide({
        slideNum: index + 1,
        header: slideDetail.header,
        description: slideDetail.description,
        urlImg: slideDetail.urlImg,
        likes: [],
        category: slideDetail.category,
      });
    });
    const createSlides = await Slide.create(slideObj);
    const post = new Post({
      slides: createSlides.map((slide) => slide._id),
      postBy: req.user,
    });
    user.posts.push(post._id)
    await post.save();
    await user.save()
    console.log(post._id)
    res.status(201).send({ message: "Post created  Successfully", });
  } catch (error) {
    next(error);
  }
};

const editPost = async (req, res, next) => {
  const { slides: editedSlides } = req.body;
  const { id } = req.params;
  try {
    const existingPost =await Post.findById(id)
    await Slide.deleteMany({_id:{$in:existingPost.slides}})
    const slideObj = editedSlides.map((slideDetail, index) => {

      return new Slide({
        slideNum: index + 1,
        header: slideDetail.header,
        description: slideDetail.description,
        urlImg: slideDetail.urlImg,
        likes: [],
        category: slideDetail.category,
      });
    });
    const createSlides = await Slide.create(slideObj);
    existingPost.slides = createSlides.map((slide) => slide._id);
    await existingPost.save();
    res.status(200).send({ message: "post updated Successfully",post:existingPost._id });
  } catch (error) {
    next(error);
  }
};
const getBYCategory = async (req, res, next) => {
    const { category } = req.params;

    try {
      const posts = await Post.find({}).populate({
        path: 'slides',
        match: { category }
      }).exec();
  
      const filteredPosts = posts.filter(post => post.slides.length > 0);
  
      res.status(200).json({ posts: filteredPosts });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPostDetailsById, createPost, editPost, getBYCategory };
