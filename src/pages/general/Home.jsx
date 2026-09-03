import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./home.css";

// 1. Fallback dummy data
const demoVideos = [
  {
    _id: "demo-1",
    vedios: "https://ik.imagekit.io/odlhfbqhh/141e60f7-a2e8-4106-8c6c-fc3ac5fdb6d1_pjKVvByee.mp4",
    name: "Delicious Pizza",
    description: "Freshly baked wood-fired pizza with extra cheese!",
    foodPartner: "123",
  },
  {
    _id: "demo-2",
    vedios: "https://ik.imagekit.io/odlhfbqhh/5308434c-a374-4502-899e-3b6390151cc0_MzmW4gGtO.mp4",
    name: "Lemonade Juice",
    description: "Refreshing lemonade with a hint of mint.",
    foodPartner: "456",
  },
  {
    _id: "demo-3",
    vedios: "https://ik.imagekit.io/odlhfbqhh/9218f706-fd46-47c6-a0c9-109344e74684_4iS-s_r_H.mp4",
    name: "Rice Bowl",
    description: "Healthy and delicious rice bowl with fresh ingredients.",
    foodPartner: "789",
  },
  {
    _id: "demo-4",
    vedios: "https://ik.imagekit.io/odlhfbqhh/b1045eb7-b97c-4c05-a2e3-edcd92df616d_IAcRDrSjY.mp4",
    name: "Paranthe",
    description: "Delicious and fluffy paranthas with a variety of fillings.",
    foodPartner: "012",
  },
];

// 2. SVG Icon component
const Icon = ({ name, size = 28, filled = false }) => {
  const paths = {
    heart: (
      <path
        d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8a4.7 4.7 0 0 1 8-3.3L12 6.3l.8-.8a4.7 4.7 0 0 1 8 3.3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
    bookmark: (
      <path
        d="M6.5 4.5A1.5 1.5 0 0 1 8 3h8a1.5 1.5 0 0 1 1.5 1.5V21L12 17.5 6.5 21V4.5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
    comment: (
      <path
        d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.8-.8L4 20l1.2-3.8A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
    home: (
      <path
        d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

const Home = () => {
  const [videos, setVideos] = useState(demoVideos);
  const [likedIds, setLikedIds] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likeError, setLikeError] = useState("");
  const [savedIds, setSavedIds] = useState([]);

  const containerRef = useRef(null);
  const videoElementsRef = useRef([]);

  // --- 1. BACKEND SE VIDEOS AUR USER DATA FETCH ---
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food/get-items", { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.foodItems && response.data.foodItems.length > 0) {
          setVideos(response.data.foodItems);

          if (response.data.userSavedIds) {
            setSavedIds(response.data.userSavedIds);
          }
          if (response.data.userLikedIds) {
            setLikedIds(response.data.userLikedIds);
          }
        } else {
          setVideos(demoVideos);
        }
      })
      .catch((error) => {
        console.warn("Backend offline, fallback demo videos active:", error.message);
        setVideos(demoVideos);
      });
  }, []);

  // --- 2. INTERSECTION OBSERVER (SCROLL PE AUTOPLAY/PAUSE) ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 }
    );

    videoElementsRef.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  // --- 3. TAP TO PLAY/PAUSE ---
  const handleVideoClick = (e) => {
    const video = e.target;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // --- 4. LIKE BUTTON TOGGLE ---
  const toggleLike = async (id) => {
    setLikeError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: id },
        { withCredentials: true }
      );

      setLikedIds((current) => {
        const isLiked = response.data.liked;
        if (isLiked && !current.includes(id)) return [...current, id];
        if (!isLiked) return current.filter((item) => item !== id);
        return current;
      });

      setLikeCounts((current) => ({
        ...current,
        [id]: response.data.likeCount,
      }));
    } catch (error) {
      const message = error.response?.data?.message || "Like save nahi ho saka";
      setLikeError(message);
    }
  };

  // --- 5. SAVE / BOOKMARK BUTTON TOGGLE ---
  const toggleSave = async (foodId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: foodId },
        { withCredentials: true }
      );

      setSavedIds((current) => {
        const isSaved = response.data.saved ?? !current.includes(foodId);
        if (isSaved && !current.includes(foodId)) {
          return [...current, foodId];
        } else {
          return current.filter((id) => id !== foodId);
        }
      });
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="reels-container" ref={containerRef}>
      {likeError && (
        <div
          className="like-error"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            zIndex: 9999,
          }}
        >
          {likeError}
        </div>
      )}

      {videos.map((item, index) => (
        <div className="reel-card" key={item._id}>
          <video
            ref={(el) => (videoElementsRef.current[index] = el)}
            src={item.vedios || item.video || item.videoUrl}
            className="reel-video"
            loop
            muted
            autoPlay
            playsInline
            onClick={handleVideoClick}
          />

          <div className="reel-overlay">
            {/* Title, Description & Visit Store Button (Above bottom nav) */}
            <div className="reel-content">
              <h3 className="reel-title">{item.name || item.title || "Special Dish"}</h3>
              <p className="reel-description">{item.description}</p>
              
              <Link
                to={`/food-partner/${item.foodPartner || item.partnerId}`}
                className="visit-store-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Store
              </Link>
            </div>

            {/* Right Side Floating Actions */}
            <div className="reel-actions">
              {/* Like Button */}
              <button
                type="button"
                className={`reel-action ${likedIds.includes(item._id) ? "is-active" : ""}`}
                style={{
                  color: likedIds.includes(item._id) ? "#ff2d55" : "#ffffff",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(item._id);
                }}
              >
                <Icon name="heart" size={30} filled={likedIds.includes(item._id)} />
                <span>{Math.max(0, likeCounts[item._id] ?? item.likeCount ?? 0)}</span>
              </button>

              {/* Save Button */}
              <button
                type="button"
                className={`reel-action ${savedIds.includes(item._id) ? "is-active" : ""}`}
                style={{
                  color: savedIds.includes(item._id) ? "#ffd700" : "#ffffff",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(item._id);
                }}
              >
                <Icon name="bookmark" size={30} filled={savedIds.includes(item._id)} />
                <span>{savedIds.includes(item._id) ? "Saved" : "Save"}</span>
              </button>

              {/* Comment Button */}
              <button
                type="button"
                className="reel-action"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon name="comment" size={30} />
                <span>45</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/home" className="nav-item active">
          <Icon name="home" size={24} filled />
          <span>Home</span>
        </Link>
        <Link to="/saved" className="nav-item">
          <Icon name="bookmark" size={24} />
          <span>Saved</span>
        </Link>
      </nav>
    </div>
  );
};

export default Home;