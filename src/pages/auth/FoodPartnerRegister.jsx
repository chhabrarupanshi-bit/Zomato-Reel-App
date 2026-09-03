import { Link } from 'react-router-dom'
import '../../styles/auth.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const FoodPartnerRegister = () => {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const Businessname = e.target.Businessname.value;
        const Ownername = e.target.Ownername.value;
        const address = e.target.address.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const password = e.target.password.value;

        console.log("Form submitted:", { Businessname, Ownername, address, email, phone, password });

        try{

        const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
            Businessname: Businessname,
            Ownername: Ownername,
            address: address,
            email: email,
            phone: phone,
            password: password
        }, {
            withCredentials: true

        })
        

        console.log("Response:", response.data);

        navigate('/create-food') ; // Navigate to the create food page after successful registration
        } catch (error) {
            console.error("Error:", error);
        }
    }


    return (
        <div className="auth-shell partner-theme">
            <div className="auth-panel">
                <div className="auth-header">
                    <div className="brand-mark">F</div>
                    <div>
                        <p className="eyebrow">Partner with us</p>
                        <h1>Food Partner Register</h1>
                    </div>
                </div>

                <p className="intro-text">Grow your kitchen business with a smarter food delivery connection.</p>

                <form className="auth-form" aria-label="Food Partner Register Form" onSubmit={handleSubmit}>
                    <div className="field-row">
                        <label className="field">
                            <span>Business name</span>
                            <input type="text" placeholder="Green Bowl" name="Businessname" />
                        </label>

                        <label className="field">
                            <span>Owner name</span>
                            <input type="text" placeholder="Alicia Stone" name="Ownername" />
                        </label>
                    </div>

                    <label className="field">
                        <span>Address</span>
                        <input type="text" placeholder="123 Main St" name="address" />
                    </label>

                    <label className="field">
                        <span>Email</span>
                        <input type="email" placeholder="partner@example.com" name="email" />
                    </label>

                    <label className="field">
                        <span>Phone</span>
                        <input type="tel" placeholder="+1 234 567 890" name="phone" />
                    </label>

                    <label className="field">
                        <span>Password</span>
                        <input type="password" placeholder="Create a password" name="password" />
                    </label>

                    <button type="submit" className="primary-button">Create food partner account</button>

                    <div className="divider"><span>or</span></div>

                    <Link to="/foodpartner/login" className="secondary-button auth-link-button">Already a partner?</Link>

                    <div className="auth-footer">
                        <span>Switch account type</span>
                        <div className="role-switch-links">
                            <Link to="/user/register">User</Link>
                            <Link to="/foodpartner/register" className="active">Food Partner</Link>
                        </div>
                    </div>
                </form>
            </div>

            <div className="auth-visual">
                <span className="visual-badge">Grow • Reach • Serve</span>
                <h2>Bring your food business closer to more customers.</h2>
                <ul>
                    <li>Reach local customers faster</li>
                    <li>Streamlined partner onboarding</li>
                    <li>Built for daily operations</li>
                </ul>
            </div>
        </div>
    )
}

export default FoodPartnerRegister
