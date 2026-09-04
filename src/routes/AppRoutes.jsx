import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserRegister from '../pages/auth/UserRegister'
import UserLogin from '../pages/auth/UserLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import Home from '../pages/general/Home'
import CreateFood from '../pages/food-partner/CreateFood'
import Profile from '../pages/food-partner/Profile'
import Saved from '../pages/general/Saved'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* User Auth */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />

        {/* Food Partner Auth (Dono common URL variants supported) */}
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />

        {/* Feeds & Actions */}
        <Route path="/home" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/create-food" element={<CreateFood />} />

        {/* Profile Dynamic Route (Always keep after static partner routes) */}
        <Route path="/food-partner/:id" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes;