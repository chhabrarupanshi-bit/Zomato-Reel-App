import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("foodPartnertoken");
        console.log("Token from localStorage:", token);
        // Backend se Food Partner aur uski Videos fetch karna
        axios.get(`https://zomato-reel-app-backend.vercel.app/api/food-partner/${id}`,  {
            headers: {
            Authorization: `Bearer ${token}` // Backend middleware req.headers.authorization se read karega
        }}
        )
            .then((res) => {
                setProfile(res.data.foodPartner);
                setVideos(res.data.foods || []);
                console.log("Profile data fetched:", res.data);
            })
            .catch((err) => {
                console.error("Profile load karne me error:", err);
            });
    }, [id]);

    return (
        <main className="profile-page">
            {/* 1. Header (Logo, Name, Address) */}
            <section className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {profile?.Businessname ? profile.Businessname.slice(0, 2).toUpperCase() : 'MS'}
                    </div>
                </div>
                <div className="profile-info">
                    <h1 className="profile-business-name">{profile?.Businessname || 'Business Name'}</h1>
                    <p className="profile-address">{profile?.address || 'Address not provided'}</p>
                </div>
            </section>

            {/* 2. Stats (Total Meals, Customers) */}
            <section className="profile-stats-section">
                <div className="stat-card">
                    <div className="stat-label">TOTAL MEALS</div>
                    <div className="stat-value">{videos.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">CUSTOMERS SERVED</div>
                    <div className="stat-value">1.2k</div>
                </div>
            </section>

            {/* 3. Videos Grid Section */}
            <section className="profile-videos-section">
                <h2 className="videos-section-title">Featured Menu</h2>

                {videos.length === 0 ? (
                    <div className="empty-state">
                        <p>No videos available yet</p>
                    </div>
                ) : (
                    <div className="videos-grid">
                        {videos.map((item) => (
                            <div key={item._id} className="video-card">
                                <video
                                    src={item.vedios || item.video}
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => e.target.play()}
                                    onMouseLeave={(e) => {
                                        e.target.pause();
                                        e.target.currentTime = 0;
                                    }}
                                />
                                <div className="video-title-overlay">{item.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Profile;