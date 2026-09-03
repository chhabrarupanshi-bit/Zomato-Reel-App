import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerLogin = () => {
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log("Form submitted:", { email, password });
        try {
            const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
                email,
                password,
            },{
                withCredentials: true // Ensure cookies are sent with the request
            });
            console.log("Login successful:", response.data);

            console.log("Success Response:", response.data.foodPartner.foodPartnertoken);

            if(response.data.foodPartner && response.data.foodPartner.foodPartnertoken) {
                localStorage.setItem("foodPartnertoken", response.data.foodPartner.foodPartnertoken);
            navigate("/create-food"); // Navigate to the create food page after successful login
            // Success handling (e.g. redirect navigate("/dashboard"))
            }
            else {
                console.error("Login failed: No token received");
                alert("Login failed: No token received");   
            }

        } catch (error) {
            console.error("Error Response:", error);
            if (error.response) {
                // Backend se jo 400 error message aya hai
                console.log("Backend Error Message:", error.response.data.message);
                alert(error.response.data.message);
            } else {
                console.error("Network/Server error:", error.message);
            }
        }
    };
    return (
        <div className="auth-shell partner-theme">
            <div className="auth-panel">
                <div className="auth-header">
                    <div className="brand-mark">F</div>
                    <div>
                        <p className="eyebrow">Partner access</p>
                        <h1>Food Partner Login</h1>
                    </div>
                </div>

                <p className="intro-text">Welcome back. Manage your kitchen operations with ease.</p>

                <form className="auth-form" aria-label="Food Partner Login Form" onSubmit={handleSubmit}>
                    <label className="field">
                        <span>Email</span>
                        <input type="email" placeholder="partner@example.com" name="email" />
                    </label>

                    <label className="field">
                        <span>Password</span>
                        <input type="password" placeholder="Enter your password" name="password" />
                    </label>

                    <button type="submit" className="primary-button">Sign in as partner</button>

                    <div className="divider"><span>or</span></div>

                    <Link to="/foodpartner/register" className="secondary-button auth-link-button">Register your business</Link>

                    <div className="auth-footer">
                        <span>Switch account type</span>
                        <div className="role-switch-links">
                            <Link to="/user/login">User</Link>
                            <Link to="/foodpartner/login" className="active">Food Partner</Link>
                        </div>
                    </div>
                </form>
            </div>

            <div className="auth-visual">
                <span className="visual-badge">Orders • Growth • Service</span>
                <h2>Manage your menu and deliveries from one place.</h2>
                <ul>
                    <li>Customer order visibility</li>
                    <li>Operational simplicity</li>
                    <li>Smarter business flow</li>
                </ul>
            </div>
        </div>
    )
}

export default FoodPartnerLogin
