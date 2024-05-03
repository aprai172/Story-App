import React, { useEffect, useState } from "react";
import styles from "./categorySection.module.css";

import Story from "../Story/Story";
import axios from "axios";

const CategorySection = (props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [categoryStories, setCategoryStories] = useState([]);
  const [maxStoriesInRow] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCategoryStories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/post/${
            props.category
          }`
        );

        if (response.status === 200) {
          const data = response.data;
          setCategoryStories(data.posts);
        } else {
          console.error("Failed to fetch category stories");
        }
      } catch (error) {
        console.error("Error fetching category stories:", error);
      }
    };

    fetchCategoryStories();

    
  }, [props.category, props.selectedFilters]);
  if (categoryStories.length === 0) {
    return (
      <div className={styles.categoryContainer}>
        
          <div className={styles.categoryHeader}>
            Top stories about {props.category}
          </div>
      
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            color: "#8E8E8E",
          }}
        >
         <h1> No stories Available</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.categoryContainer}>
        
          <div className={styles.categoryHeader}>
            Top stories about {props.category}
          </div>

          {categoryStories ? (
      <div className={styles.categoryStories}>
        {categoryStories
          .slice(0, isExpanded ? categoryStories.length : maxStoriesInRow)
          .map((story, index) => (
            <Story
              key={index}
              story={story}
              authValidated={props.authValidated}
              handleStoryViewer={props.handleStoryViewer}
            />
          ))}
      </div>
    ) : (
      <div className={styles.loadingContainer}>
        <LoadingAnimation />
      </div>
    )}
        {!isMobile && maxStoriesInRow < categoryStories.length && (
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              console.log(isExpanded);
            }}
            className={styles.seemoreBtn}
          >
            {isExpanded ? "Show less" : "See more"}
          </button>
        )}
      </div>
    </>
  );
};

export default CategorySection;
