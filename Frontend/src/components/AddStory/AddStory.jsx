import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./addStory.module.css";
import ModalContainer from "../ModalContainer/ModalContainer";
import modalCloseIcon from "../../assets/modalCloseIcon.jpg";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Slide = (props) => (
  <div className={styles.slideContainer}>
    {[...Array(props.slideCount)].map((_, index) => (
      <div
        key={index}
        onClick={() => props.handleSlideClick(index + 1)}
        style={{
          border:
            index + 1 === props.activeSlideIndex
              ? "2px solid #73ABFF"
              : "2px solid transparent",
        }}
        className={styles.slideNumber}
      >
        Slide {index + 1}
        {props.activeSlideIndex === index + 1 && (
          <img
            onClick={async () => {
              if (index + 1 === props.slideCount) {
                await props.handleSlideClick(index + 1);
                props.handleDeleteSlide(index + 1);
              } else {
                props.handleDeleteSlide(index + 1);
              }
            }}
            className={styles.modalCloseIcon}
            src={modalCloseIcon}
            alt="modal-close-icon"
          />
        )}
      </div>
    ))}
    {props.slideCount < 6 && (
      <div
        onClick={() => {
          props.handleAddSlide();
        }}
        className={styles.addSlide}
      >
        Add +
      </div>
    )}
  </div>
);

const Form = (props) => {
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
          placeholder="Your heading"
        />
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
          placeholder="Add Image uri"
        />
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

const AddStory = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const id = searchParams.get("id");

  console.log(id);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const [slideCount, setSlideCount] = useState(3);
  const [postData, setPostData] = useState({
    slides: [
      {
        header: "",
        description: "",
        urlImg: "",
        category: "",
      },
      {
        header: "",
        description: "",
        urlImg: "",
        category: "",
      },
      {
        header: "",
        description: "",
        urlImg: "",
        category: "",
      },
    ],
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

  useEffect(() => {
    if (id) {
      const getPost = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/post/postData/${id}`
          );
      
          if (response.status === 200) {
            const data = response.data;
            console.log(data);
            setPostData(data);
            setSlideCount(data.slides.length);
          } else {
            console.error("Failed to fetch category stories");
          }
        } catch (error) {
          console.error("Error fetching category stories:", error);
        }
      };
      
      getPost();
    }
  }, [id]);

  const handleAddSlide = () => {
    setSlideCount(slideCount + 1);
    setActiveSlideIndex(slideCount + 1);
    const newPostData = { ...postData };
    newPostData.slides.push({
      header: "",
      description: "",
      urlImg: "",
      category: "",
    });
    setPostData(newPostData);
    if (slideCount >= 3) {
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleSlideClick = (index) => {
    setActiveSlideIndex(index);
  };

  const handleHeadingChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].header = value;
    setPostData(newPostData);
  };

  const handleDescriptionChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].description = value;
    setPostData(newPostData);
  };

  const handleImageChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].urlImg = value;
    setPostData(newPostData);
  };

  const handleCategoryChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].category = value;
    setPostData(newPostData);
  };

  const handleDeleteSlide = (index) => {
    if (slideCount === 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }
    if (index === postData.slides.length) {
      setActiveSlideIndex(index - 1);
    }

    const newPostData = { ...postData };
    newPostData.slides.splice(index - 1, 1);

    if (index === activeSlideIndex) {
      setActiveSlideIndex(Math.max(index - 1, 1));
    } else if (index < activeSlideIndex) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }

    setSlideCount(slideCount - 1);
    setPostData(newPostData);
  };

  const handlePost = async () => {
    const error = postData.slides.some(
      (slide) =>
        slide.header === "" ||
        slide.description === "" ||
        slide.urlImg === "" ||
        slide.category === ""
    );
  
    if (postData.slides.length < 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }
  
    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields in all slides");
      return;
    }
  
    setShowError(false);
    setErrorMessage("");
  
    setIsProcessing(true);
    try {
      console.log(postData.slides);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/post/addpost`,
        { slides: postData.slides },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
  
      console.log(response);
      if (response.status === 201) {
        toast.success("Post created successfully");
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        console.log("Error creating post");
        toast.error("Error creating post");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const handleUpdate = async () => {
    const error = postData.slides.some(
      (slide) =>
        slide.header === "" ||
        slide.description === "" ||
        slide.urlImg === "" ||
        slide.category === ""
    );

    if (slideCount < 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }

    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields in all slides");
      return;
    }

    setShowError(false);
    setErrorMessage("");

    setIsProcessing(true);
    try {
      const payload = postData.slides.map((slide) => ({
        slideNumber: slide.slideNumber,
        header: slide.header,
        description: slide.description,
        urlImg: slide.urlImg,
        category: slide.category,
      }));
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/post/edit/${id}`,
        { slides: payload },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
    
      if (response.status === 200) {

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
        toast.success("Post updated successfully");
      } else {

        console.log("Error updating post");
        toast.error("Error updating post");
      }
    }catch (error) {

      console.error("Network error:", error);
      toast.error("Network error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <ModalContainer>
          <ToastContainer />
        <h1 className={styles.formHeader}>Processing...</h1>
      </ModalContainer>
    );
  }

  return (
        <>
    <ModalContainer>
      <ToastContainer />
      
       

          <Slide
            slideCount={slideCount}
            activeSlideIndex={activeSlideIndex}
            handleSlideClick={handleSlideClick}
            handleAddSlide={handleAddSlide}
            handleDeleteSlide={handleDeleteSlide}
          />
          <Form
            postData={postData}
            activeSlideIndex={activeSlideIndex}
            handleHeadingChange={handleHeadingChange}
            handleDescriptionChange={handleDescriptionChange}
            handleImageChange={handleImageChange}
            handleCategoryChange={handleCategoryChange}
          />
          {showError && <div className={styles.error}>{errorMessage}</div>}
          <div className={styles.btnContainer}>
            <div className={styles.leftBtnContainer}>
              <button
                onClick={() => {
                  setActiveSlideIndex(activeSlideIndex - 1);
                  if (activeSlideIndex === 1) {
                    setActiveSlideIndex(1);
                  }
                }}
                className={styles.prevBtn}
              >
                Previous
              </button>
              <button
                onClick={() => {
                  setActiveSlideIndex(activeSlideIndex + 1);
                  if (activeSlideIndex === slideCount) {
                    setActiveSlideIndex(slideCount);
                  }
                }}
                className={styles.nextBtn}
              >
                Next
              </button>
            </div>
            <div>
              <button
                onClick={id ? handleUpdate : handlePost}
                className={styles.postBtn}
              >
                {id ? "Update" : "Post"}
              </button>
            </div>
          </div>
      
    </ModalContainer>
        </>
  );
};

export default AddStory;
