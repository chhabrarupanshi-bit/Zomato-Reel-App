const AuthPage = ({ type = 'user', mode = 'register' }) => {
  const isUser = type === 'user'
  const isRegister = mode === 'register'

  const audience = isUser ? 'User' : 'Food Partner'
  const introText = isRegister
    ? isUser
      ? 'Create your account to get started.'
      : 'Register your food business and grow with us.'
    : isUser
      ? 'Welcome back! Please enter your details.'
      : 'Welcome back! Sign in to manage your profile.'

  const submitLabel = isRegister ? `Create ${audience} account` : `Sign in as ${audience}`

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-header">
          <div className="brand-mark">{audience.charAt(0)}</div>
          <div>
            <p className="eyebrow">{isRegister ? 'New account' : 'Welcome back'}</p>
            <h1>{isRegister ? `${audience} Register` : `${audience} Login`}</h1>
          </div>
        </div>

        <p className="intro-text">{introText}</p>

        <form className="auth-form" aria-label={`${audience} ${mode}`}>
          {isRegister && (
            <div className="field-row">
              <label className="field">
                <span>First name</span>
                <input type="text" placeholder="John" />
              </label>

              <label className="field">
                <span>Last name</span>
                <input type="text" placeholder="Doe" />
              </label>
            </div>
          )}

          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="name@example.com" />
          </label>

          {isRegister && (
            <label className="field">
              <span>Phone</span>
              <input type="tel" placeholder="+1 234 567 890" />
            </label>
          )}

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>

          {isRegister && (
            <label className="field">
              <span>Confirm password</span>
              <input type="password" placeholder="Repeat password" />
            </label>
          )}

          <button type="button" className="primary-button">
            {submitLabel}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button type="button" className="secondary-button">
            {isRegister ? 'Already have an account?' : 'Create new account'}
          </button>
        </form>
      </div>

      <div className="auth-visual" aria-hidden="true">
        <span className="visual-badge">Simple • Secure • Seamless</span>
        <h2>
          {isRegister
            ? `Join the ${audience.toLowerCase()} network.`
            : `Continue your ${audience.toLowerCase()} experience.`}
        </h2>
        <ul>
          <li>Fast onboarding</li>
          <li>Clean and focused flow</li>
          <li>Designed for everyday use</li>
        </ul>
      </div>
    </div>
  )
}

export default AuthPage
