import React from "react";
import styles from "./addStory.module.css";

export const Form = (props) => {
  if (props.activeSlideIndex > props.postData.slides.length) {
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <div>
        <label>Heading:</label>
        <input
          onChange={(e) => {
            props.handleHeadingChange(props.activeSlideIndex, e.target.value);
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].header}
          type="text"
          placeholder="Your heading" />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          onChange={(e) => {
            props.handleDescriptionChange(
              props.activeSlideIndex,
              e.target.value
            );
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].description}
          placeholder="Story description"
        ></textarea>
      </div>
      <div>
        <label>Image:</label>
        <input
          onChange={(e) => {
            props.handleImageChange(props.activeSlideIndex, e.target.value);
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].urlImg}
          type="text"
          placeholder="Add Image uri" />
      </div>
      <div>
        <label>Category:</label>
        <select
          onChange={(e) => {
            props.handleCategoryChange(props.activeSlideIndex, e.target.value);
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].category}
        >
          <option value="">Select</option>
          <option value="Education">Education</option>
          <option value="Fashion">Fashion</option>
          <option value="Fitness">Fitness</option>
          <option value="Food">Food</option>
          <option value="Movie">Movie</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Travel">Travel</option>
        </select>
      </div>
    </div>
  );
};
