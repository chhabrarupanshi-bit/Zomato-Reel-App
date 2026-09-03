import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const UserRegister = () => {
    const navigate = useNavigate(); // Import useNavigate for navigation


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here

        const firstName = e.target.firstName.value ;
        const lastName = e.target.lastName.value ;
        const email = e.target.email.value ;
        const password = e.target.password.value ;

        console.log("Form submitted:", { firstName, lastName, email, password });

        const response = await axios.post('http://localhost:3000/api/auth/user/register' , {
            fullName : firstName + " " + lastName ,
            email : email ,
            password : password
        } , {
            withCredentials : true 
        } )

        console.log("Response:", response);

        navigate("/home") ; // Navigate to the home page after successful registration
    }

  return (
    <div className="auth-shell user-theme">
      <div className="auth-panel">
        <div className="auth-header">
          <div className="brand-mark">U</div>
          <div>
            <p className="eyebrow">New account</p>
            <h1>User Register</h1>
          </div>
        </div>

        <p className="intro-text">Create your account to start ordering your favorite meals.</p>

        <form className="auth-form" aria-label="User Register Form" onSubmit = {handleSubmit}>
          <div className="field-row">
            <label className="field">
              <span>First name</span>
              <input type="text" placeholder="John" name="firstName" />
            </label>

            <label className="field">
              <span>Last name</span>
              <input type="text" placeholder="Doe" name="lastName" />
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="name@example.com" name="email" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Create a password" name="password" />
          </label>

          <button type="submit" className="primary-button">Create user account</button>

          <div className="divider"><span>or</span></div>

          <Link to="/user/login" className="secondary-button auth-link-button">Already have an account?</Link>

          <div className="auth-footer">
            <span>Switch account type</span>
            <div className="role-switch-links">
              <Link to="/user/register" className="active">User</Link>
              <Link to="/foodpartner/register">Food Partner</Link>
            </div>
          </div>
        </form>
      </div>

      <div className="auth-visual">
        <span className="visual-badge">Fresh • Fast • Simple</span>
        <h2>Join and discover meals you’ll love.</h2>
        <ul>
          <li>Quick registration</li>
          <li>Easy meal browsing</li>
          <li>Personalized ordering experience</li>
        </ul>
      </div>
    </div>
  )
}

export default UserRegister
