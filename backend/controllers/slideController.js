const Slide = require("../models/slide");

const getSlideById = async (req, res, next) => {
  const { slideId } = req.params;
  try {
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ error: "Slide not found" });
    }
    res.status(200).json({ slide });
  } catch (error) {
    next(error);
  }
};

module.exports = {getSlideById}
