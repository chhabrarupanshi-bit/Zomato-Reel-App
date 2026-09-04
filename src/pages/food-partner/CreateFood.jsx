import React, { useState } from 'react';
import './CreateFood.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
  const [formData, setFormData] = useState({
    vedios: null,
    name: '',
    description: ''
  });

  const navigate = useNavigate();
  const [videoPreview, setVideoPreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vercel Serverless Function Limit Check (4.5 MB = 4.5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("Video file 4.5 MB se choti honi chahiye (Vercel upload limit). Kripya compressed ya short clip chunein.");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setVideoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return previewUrl;
    });

    setFormData((prev) => ({
      ...prev,
      vedios: file
    }));
  };

  const handleRemoveVideo = () => {
    setVideoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });

    setFormData((prev) => ({
      ...prev,
      vedios: null
    }));

    const fileInput = document.getElementById('food-video');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vedios || !formData.name || !formData.description) {
      alert('Please fill in all fields and upload a video.');
      return;
    }

    const submitData = new FormData();
    submitData.append('vedios', formData.vedios);
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);

    const token = localStorage.getItem("foodPartnertoken") || localStorage.getItem("token");

    try {
      const response = await axios.post(
        'https://zomato-reel-app-backend.vercel.app/api/food/',
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );
      console.log('Food created successfully:', response.data);
      alert('Food created successfully!');
      navigate("/home");
    } catch (error) {
      console.error('Error creating food:', error);
      alert(
        error.response?.data?.message || error.message || 'Something went wrong while creating food.'
      );
    }
  };

  return (
    <main className="create-food-page">
      <section className="create-food-card">
        <div className="create-food-header">
          <div className="icon-badge">🍽️</div>
          <div>
            <p className="eyebrow">Food Partner</p>
            <h1>Create Food</h1>
          </div>
        </div>

        <form className="food-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <span>Upload Video</span>

            <label className="upload-box" htmlFor="food-video">
              <div className="upload-icon-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="upload-icon">
                  <path
                    d="M12 16V4m0 0l-4 4m4-4l4 4M5 18.5A2.5 2.5 0 0 0 7.5 21h9A2.5 2.5 0 0 0 19 18.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="upload-text">
                <strong>Upload food video</strong>
                <small>MP4, MOV up to 4.5MB</small>
              </div>
            </label>

            <input
              id="food-video"
              type="file"
              name="vedios"
              accept="video/*"
              onChange={handleFileChange}
              className="file-input"
            />

            <small className="file-name">
              {formData.vedios
                ? `Selected: ${formData.vedios.name}`
                : 'No file selected yet'}
            </small>

            {videoPreview && (
              <div className="video-preview-box">
                <video
                  src={videoPreview}
                  controls
                  className="video-preview-player"
                />

                <div className="video-actions">
                  <label
                    htmlFor="food-video"
                    className="video-action-btn change-btn"
                  >
                    Change
                  </label>

                  <button
                    type="button"
                    className="video-action-btn remove-btn"
                    onClick={handleRemoveVideo}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <label className="form-field">
            <span>Food Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter food name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Write a short description of the food"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="submit-btn">
            Save Food
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateFood;