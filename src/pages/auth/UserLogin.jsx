import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const email = e.target.email.value ;
        const password = e.target.password.value ;
        console.log("Form submitted:", { email, password });
        
        const response = await axios.post('http://localhost:3000/api/auth/user/login' , {
            email : email, 
            password  : password } , {
                withCredentials : true
            })

        console.log("Response:", response);

        navigate("/home") ; // Navigate to the home page after successful login
    }


  return (
    <div className="auth-shell user-theme">
      <div className="auth-panel">
        <div className="auth-header">
          <div className="brand-mark">U</div>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>User Login</h1>
          </div>
        </div>

        <p className="intro-text">Sign in to continue your food journey.</p>

        <form className="auth-form" aria-label="User Login Form" onSubmit = {handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="name@example.com" name = "email" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Enter your password" name = "password" />
          </label>

          <button type="submit" className="primary-button">Sign in as user</button>

          <div className="divider"><span>or</span></div>

          <Link to="/user/register" className="secondary-button auth-link-button">Create new account</Link>

          <div className="auth-footer">
            <span>Switch account type</span>
            <div className="role-switch-links">
              <Link to="/user/login" className="active">User</Link>
              <Link to="/foodpartner/login">Food Partner</Link>
            </div>
          </div>
        </form>
      </div>

      <div className="auth-visual">
        <span className="visual-badge">Enjoy • Repeat • Save</span>
        <h2>Pick your favorite meals and order again.</h2>
        <ul>
          <li>Track favorite dishes</li>
          <li>Fast checkout flow</li>
          <li>Bookmarked food picks</li>
        </ul>
      </div>
    </div>
  )
}

export default UserLogin
