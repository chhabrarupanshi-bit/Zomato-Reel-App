import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./home.css";

// 1. Fallback dummy data
const demoVideos = [
  {
    _id: "demo-1",
    vedios: "https://ik.imagekit.io/aknzkcjdb/ac74cc6a-87eb-4c67-a47a-e4c44906d512_VqNHoK1N7.mp4",
    name: "Pasta Delight",
    description: "Freshly baked wood-fired pizza with extra cheese!",
    foodPartner: "123",
  },
  {
    _id: "demo-2",
    vedios: "https://ik.imagekit.io/aknzkcjdb/fb37ec27-b55c-4253-bf00-c07e4da05773_cjbXf59O7.mp4",
    name: "Lemonade Juice",
    description: "Refreshing lemonade with a hint of mint.",
    foodPartner: "456",
  },
  {
    _id: "demo-3",
    vedios: "https://ik.imagekit.io/aknzkcjdb/9ca27c3d-cec7-4480-9928-0367cfefedfe_1dVL2ZiV9.mp4",
    name: "Pastries",
    description: "Healthy and delicious pastries with fresh ingredients.",
    foodPartner: "789",
  },
  {
    _id: "demo-4",
    vedios: "https://ik.imagekit.io/aknzkcjdb/a2918f8a-7d21-4b26-b324-4c812441f1d9_QsWBuaCF3.mp4",
    name: "Strawberry Smoothie",
    description: "Delicious and refreshing strawberry smoothie.",
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
    const token = localStorage.getItem("token") || localStorage.getItem("foodPartnertoken");

    axios
      .get("https://zomato-reel-app-backend.vercel.app/api/food/get-items", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      })
      .then((response) => {
        console.log("=== FEED API RESPONSE ===", response.data);

        if (response.data && response.data.foodItems && response.data.foodItems.length > 0) {
          setVideos(response.data.foodItems);

          if (response.data.userSavedIds) {
            setSavedIds(response.data.userSavedIds);
          }
          if (response.data.userLikedIds) {
            setLikedIds(response.data.userLikedIds);
          }
        } else {
          console.warn("No food items returned, using fallback demo videos.");
          setVideos(demoVideos);
        }
      })
      .catch((error) => {
        console.error("Feed API error:", error.response?.data || error.message);
        setVideos(demoVideos);
      });
  }, []);

  // --- 2. INTERSECTION OBSERVER (AUTOPLAY/PAUSE ON SCROLL) ---
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
    const token = localStorage.getItem("token") || localStorage.getItem("foodPartnertoken");

    try {
      const response = await axios.post(
        "https://zomato-reel-app-backend.vercel.app/api/food/like",
        { foodId: id },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      console.log("=== LIKE API RESPONSE ===", response.data);

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
      console.error("Like error details:", error.response?.data || error.message);
      setLikeError(message);
    }
  };

  // --- 5. SAVE / BOOKMARK BUTTON TOGGLE ---
  const toggleSave = async (foodId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("foodPartnertoken");

    try {
      const response = await axios.post(
        "https://zomato-reel-app-backend.vercel.app/api/food/save",
        { foodId: foodId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      console.log("=== SAVE API RESPONSE ===", response.data);

      setSavedIds((current) => {
        const isSaved = response.data.saved ?? !current.includes(foodId);
        if (isSaved && !current.includes(foodId)) {
          return [...current, foodId];
        } else {
          return current.filter((id) => id !== foodId);
        }
      });
    } catch (error) {
      console.error("Save error details:", error.response?.data || error.message);
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