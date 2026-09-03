import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./home.css";

// Fallback dummy saved item (Jab tak backend live na ho)
const demoSavedFood = [
    {
        _id: "demo-1",
        vedios: "https://ik.imagekit.io/odlhfbqhh/141e60f7-a2e8-4106-8c6c-fc3ac5fdb6d1_pjKVvByee.mp4",
        name: "Delicious Pizza",
        description: "Freshly baked wood-fired pizza with extra cheese!",
    }
];

const Icon = ({ name, size = 22, filled = false }) => {
    const paths = {
        home: (
            <path
                d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
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
        trash: (
            <path
                d="M4 7h16m-10 4v6m4-6v6M9 7V4h6v3m-9 0 1 14h10l1-14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
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

const Saved = () => {
    const [savedFoods, setSavedFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Page render par database se saved items lana
    useEffect(() => {
        axios
            .get("http://localhost:3000/api/food/saved-items", { withCredentials: true })
            .then((res) => {
                if (res.data?.savedFoods && res.data.savedFoods.length > 0) {
                    setSavedFoods(res.data.savedFoods);
                } else {
                    setSavedFoods(demoSavedFood);
                }
            })
            .catch((err) => {
                console.warn("Backend connect nahi hua, demo saved item loading:", err.message);
                setSavedFoods(demoSavedFood);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // 2. Database / state se remove karna
    const removeSaved = async (foodId) => {
        try {
            await axios.post(
                "http://localhost:3000/api/food/save",
                { foodId },
                { withCredentials: true }
            );
        } catch (err) {
            console.warn("Backend offline, removing from local screen state:", err.message);
        }
        // Local state se drop karna
        setSavedFoods((prev) => prev.filter((item) => item._id !== foodId));
    };

    return (
        <main className="saved-page">
            <header className="saved-header">
                <p className="saved-kicker">Your collection</p>
                <h1>Saved videos</h1>
                <p>Keep the dishes you want to come back to.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>Loading saved dishes...</div>
            ) : savedFoods.length === 0 ? (
                <section className="saved-empty">
                    <Icon name="bookmark" size={48} />
                    <h2>No saved videos yet</h2>
                    <p>Tap the bookmark icon on a food video to save it here.</p>
                    <Link to="/home" className="browse-btn">
                        Browse food videos
                    </Link>
                </section>
            ) : (
                <section className="saved-grid">
                    {savedFoods.map((food) => (
                        <article className="saved-card" key={food._id}>
                            <video
                                src={food.vedios || food.video || food.videoUrl}
                                muted
                                loop
                                autoPlay
                                playsInline
                                onClick={(e) => (e.target.paused ? e.target.play() : e.target.pause())}
                            />

                            <div className="saved-card-info">
                                <div>
                                    <h2>{food.name || "Special Dish"}</h2>
                                    <p>{food.description}</p>
                                </div>

                                <button
                                    type="button"
                                    className="remove-saved"
                                    onClick={() => removeSaved(food._id)}
                                    aria-label={`Remove ${food.name} from saved videos`}
                                >
                                    <Icon name="trash" size={20} />
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {/* Persistent Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/home" className="nav-item">
                    <Icon name="home" size={24} />
                    <span>Home</span>
                </Link>
                <Link to="/saved" className="nav-item active">
                    <Icon name="bookmark" size={24} filled />
                    <span>Saved</span>
                </Link>
            </nav>
        </main>
    );
};

export default Saved;