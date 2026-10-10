import { useEffect, useRef, useState } from "react";

type Screen =
  | "landing"
  | "login"
  | "register"
  | "upload"
  | "prepare"
  | "processing"
  | "complete"
  | "dashboard"
  | "root"
  | "chat"
  | "action"
  | "impact"
  | "profile";

type IconName =
  | "bolt"
  | "arrow"
  | "arrow-left"
  | "upload"
  | "file"
  | "check"
  | "close"
  | "eye"
  | "chart"
  | "users"
  | "wallet"
  | "alert"
  | "spark"
  | "send"
  | "clip"
  | "search"
  | "target"
  | "trend"
  | "calendar"
  | "chevron";

const paths: Record<IconName, React.ReactNode> = {
  bolt: <path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9Z" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  "arrow-left": (
    <>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 20h16" />
    </>
  ),
  file: (
    <>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6M9 17h5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  chart: <path d="M4 19V9M10 19V5M16 19v-7M22 19V2" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 6h16v14H3z" />
      <path d="M3 9h16M15 13h7v4h-7z" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 21h20L12 3Z" />
      <path d="M12 9v5M12 18h.01" />
    </>
  ),
  spark: (
    <>
      <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  clip: (
    <path d="m21 11-8.8 8.8a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  trend: (
    <>
      <path d="m3 17 6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) => (
  <button
    className={`btn btn-${variant} ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

function BackButton({
  onClick,
  label = "Back",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      className={`back-btn ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <Icon name="arrow-left" size={15} />
      <span>{label}</span>
    </button>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-mark">
        <Icon name="bolt" size={19} />
      </span>
      <span>FlashBuzz</span>
    </div>
  );
}

function Toast({ text, warning = false }: { text: string; warning?: boolean }) {
  return (
    <div className={`toast ${warning ? "toast-warning" : ""}`}>
      <span className="toast-icon">
        <Icon name={warning ? "alert" : "check"} size={14} />
      </span>
      {text}
    </div>
  );
}

function Landing({ go }: { go: (s: Screen) => void }) {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Brand />

        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#insights">AI insights</a>
          <a href="#security">Security</a>
        </div>

       {getStoredAuth() ? (
  <Button
    variant="secondary"
    onClick={() => go("profile")}
  >
    {getStoredUser()?.name || "Profile"}
  </Button>
) : (
  <Button
    variant="secondary"
    onClick={() => go("login")}
  >
    Sign in
  </Button>
)}
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Icon name="spark" size={15} /> Your AI business copilot
          </div>

          <h1>
            Turn your business data into <span>decisions that grow.</span>
          </h1>

          <p>
            Upload your data. FlashBuzz finds hidden problems, explains why they
            happened, and tells you exactly what to do next.
          </p>

          <div className="hero-actions">
            <Button onClick={() => go("upload")}>
              Analyze my business <Icon name="arrow" />
            </Button>

            <button className="text-link" onClick={() => go("dashboard")}>
              <span className="play">▶</span> See how it works
            </button>
          </div>

          <div className="trust-row">
            <span>
              <Icon name="check" size={14} /> No credit card
            </span>
            <span>
              <Icon name="check" size={14} /> Secure & encrypted
            </span>
            <span>
              <Icon name="check" size={14} /> Insights in minutes
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow-ring"></div>

          <div className="preview-card">
            <div className="preview-top">
              <span className="mini-logo">
                <Icon name="bolt" size={13} />
              </span>
              <span>AI Business Brief</span>
              <span className="live-dot">LIVE</span>
            </div>

            <div className="preview-title">
  Good morning, {getStoredUser()?.name || "there"}.
</div>

            <div className="preview-sub">
              Here is what needs your attention today.
            </div>

            <div className="mini-kpis">
              <div>
                <small>REVENUE</small>
                <b>₹82.4L</b>
                <em>+12.4%</em>
              </div>

              <div>
                <small>PROFIT</small>
                <b>₹18.2L</b>
                <em>+8.1%</em>
              </div>
            </div>

            <div className="alert-card">
              <span className="alert-icon">
                <Icon name="alert" size={17} />
              </span>

              <div>
                <small>AI DETECTED</small>
                <b>Electronics sales decreased 31%</b>
                <p>High-value repeat customers purchased less this month.</p>
              </div>
            </div>

            <div className="recommend-card">
              <Icon name="spark" size={18} />

              <div>
                <small>RECOMMENDED NEXT STEP</small>
                <b>Re-engage 284 inactive customers</b>
              </div>

              <Icon name="chevron" />
            </div>
          </div>

          <div className="float-chip chip-one">
            <Icon name="trend" size={16} />
            <span>
              <small>Opportunity found</small>
              <b>+₹7.8L revenue</b>
            </span>
          </div>

          <div className="float-chip chip-two">
            <span className="pulse"></span>
            <span>
              <small>Analysis complete</small>
              <b>4 insights ready</b>
            </span>
          </div>
        </div>
      </section>

      <section className="logo-strip">
        <span>BUILT FOR AMBITIOUS TEAMS</span>
        <div>
          <b>Retail</b>
          <b>D2C Brands</b>
          <b>Agencies</b>
          <b>Startups</b>
          <b>Small Business</b>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   AUTHENTICATION STYLES
========================================================= */

const AuthStyles = () => (
  <style>{`
    .auth-page {
      min-height: 100vh;
      background:
        radial-gradient(
          circle at 50% 0%,
          rgba(167, 201, 87, 0.14),
          transparent 38%
        ),
        #f2e8cf;
      color: #1f2a24;
    }

    .auth-top {
      width: min(1180px, calc(100% - 48px));
      margin: 0 auto;
      padding: 28px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .auth-main {
      width: 100%;
      min-height: calc(100vh - 100px);
      padding: 30px 20px 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .auth-card {
      width: min(460px, 100%);
      padding: 42px;
      background: #fff;
      border: 1px solid #e4e0d4;
      border-radius: 24px;
      box-shadow: 0 24px 70px rgba(31, 42, 36, 0.10);
      box-sizing: border-box;
    }

    .register-card {
      width: min(560px, 100%);
    }

    .auth-icon {
      width: 52px;
      height: 52px;
      margin-bottom: 22px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: #386641;
      box-shadow: 0 10px 24px rgba(56, 102, 65, 0.22);
    }

    .auth-card h1 {
      margin: 8px 0 10px;
      font-size: 32px;
      line-height: 1.15;
      letter-spacing: -0.7px;
    }

    .auth-subtitle {
      margin: 0 0 28px;
      color: #68736d;
      line-height: 1.6;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .auth-form > label,
    .auth-two-columns label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: #1f2a24;
    }

    .auth-form input[type="email"],
    .auth-form input[type="password"],
    .auth-form input[type="text"] {
      width: 100%;
      height: 48px;
      padding: 0 14px;
      border: 1px solid #d9d7cd;
      border-radius: 10px;
      outline: none;
      background: #fff;
      color: #1f2a24;
      font: inherit;
      box-sizing: border-box;
    }

    .auth-form input:focus {
      border-color: #6a994e;
      box-shadow: 0 0 0 3px rgba(106, 153, 78, 0.12);
    }

    .auth-form input:disabled {
      opacity: 0.65;
    }

    .auth-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: -3px;
    }

    .remember-option,
    .terms-option {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12px;
      color: #68736d;
    }

    .remember-option input,
    .terms-option input {
      margin-top: 2px;
      accent-color: #386641;
    }

    .forgot-btn,
    .auth-switch button,
    .terms-option button {
      padding: 0;
      border: 0;
      background: transparent;
      color: #386641;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .forgot-btn {
      font-size: 12px;
    }

    .auth-submit {
      width: 100%;
      justify-content: center;
      min-height: 50px;
    }

    .auth-error {
      display: flex;
      align-items: center;
      gap: 9px;
      margin-bottom: 18px;
      padding: 12px 14px;
      border: 1px solid rgba(188, 71, 73, 0.25);
      border-radius: 10px;
      background: rgba(188, 71, 73, 0.08);
      color: #9f3c3e;
      font-size: 13px;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 25px 0 18px;
      color: #9aa19c;
      font-size: 12px;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: "";
      height: 1px;
      flex: 1;
      background: #e4e0d4;
    }

    .google-btn {
      width: 100%;
      height: 48px;
      border: 1px solid #d9d7cd;
      border-radius: 10px;
      background: #fff;
      color: #1f2a24;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .google-letter {
      font-size: 18px;
      font-weight: 800;
    }

    .auth-switch {
      margin: 24px 0 0;
      text-align: center;
      color: #68736d;
      font-size: 13px;
    }

    .auth-trust {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 22px;
      margin-top: 22px;
      color: #68736d;
      font-size: 11px;
    }

    .auth-trust span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .auth-trust svg {
      color: #6a994e;
    }

    .auth-two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .terms-option {
      line-height: 1.5;
    }

    @media (max-width: 600px) {
      .auth-top {
        width: calc(100% - 32px);
        padding: 20px 0;
      }

      .auth-main {
        padding: 20px 16px 50px;
      }

      .auth-card,
      .register-card {
        padding: 28px 22px;
        border-radius: 18px;
      }

      .auth-card h1 {
        font-size: 27px;
      }

      .auth-two-columns {
        grid-template-columns: 1fr;
      }

      .auth-options {
        align-items: flex-start;
        flex-direction: column;
      }

      .auth-trust {
        gap: 10px 18px;
      }
    }
  `}</style>
);

/* =========================================================
   LOGIN
========================================================= */

function Login({ go }: { go: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("flashbuzz_token", data.token);

      storage.setItem("flashbuzz_user", JSON.stringify(data.user));

      go("dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to FlashBuzz. Make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthStyles />

      <div className="auth-top">
        <Brand />

        <BackButton onClick={() => go("landing")} />
      </div>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-icon">
            <Icon name="bolt" size={24} />
          </div>

          <div className="page-kicker">WELCOME BACK</div>

          <h1>Sign in to FlashBuzz</h1>

          <p className="auth-subtitle">
            Continue turning your business data into better decisions.
          </p>

          {error && (
            <div className="auth-error">
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-form">
            <label>
              Email address
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                disabled={loading}
              />
            </label>

            <div className="auth-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={() =>
                  setError("Password reset will be available soon.")
                }
              >
                Forgot password?
              </button>
            </div>

            <Button
              className="auth-submit"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <Icon name="arrow" />}
            </Button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="google-btn"
            type="button"
            onClick={() => setError("Google sign-in is not connected yet.")}
          >
            <span className="google-letter">G</span>
            Continue with Google
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button onClick={() => go("register")}>Create one</button>
          </p>
        </div>

        <div className="auth-trust">
          <span>
            <Icon name="check" size={14} />
            Secure authentication
          </span>

          <span>
            <Icon name="check" size={14} />
            Your data stays protected
          </span>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   REGISTER
========================================================= */

function Register({ go }: { go: (s: Screen) => void }) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          business_name: businessName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      localStorage.setItem("flashbuzz_token", data.token);

      localStorage.setItem("flashbuzz_user", JSON.stringify(data.user));

      go("upload");
    } catch (err) {
      console.error("Register error:", err);

      setError(
        "Unable to connect to FlashBuzz. Make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthStyles />

      <div className="auth-top">
        <Brand />

        <BackButton onClick={() => go("landing")} />
      </div>

      <main className="auth-main">
        <div className="auth-card register-card">
          <div className="auth-icon">
            <Icon name="spark" size={24} />
          </div>

          <div className="page-kicker">GET STARTED</div>

          <h1>Create your FlashBuzz account</h1>

          <p className="auth-subtitle">
            Build smarter business decisions with AI-powered insights.
          </p>

          {error && (
            <div className="auth-error">
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-form">
            <label>
              Full name
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </label>

            <label>
              Business / company name
              <input
                type="text"
                placeholder="Your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={loading}
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            <div className="auth-two-columns">
              <label>
                Password
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </label>

              <label>
                Confirm password
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </label>
            </div>

            <label className="terms-option">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() =>
                    setError("Terms and Privacy pages will be added soon.")
                  }
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() =>
                    setError("Terms and Privacy pages will be added soon.")
                  }
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            <Button
              className="auth-submit"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && <Icon name="arrow" />}
            </Button>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={() => go("login")}>Sign in</button>
          </p>
        </div>

        <div className="auth-trust">
          <span>
            <Icon name="check" size={14} />
            Free to get started
          </span>

          <span>
            <Icon name="check" size={14} />
            Secure & encrypted
          </span>

          <span>
            <Icon name="check" size={14} />
            AI insights in minutes
          </span>
        </div>
      </main>
    </div>
  );
}

function Upload({ go }: { go: (s: Screen) => void }) {
  const [files, setFiles] = useState<File[]>([]);
const [drag, setDrag] = useState(false);
const [error, setError] = useState("");

const analyzeFiles = async () => {
  if (files.length === 0) {
    setError("Please upload at least one file.");
    return;
  }

  try {
    setError("");

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(
      "http://localhost:5000/api/analysis/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Analysis failed.",
      );
    }

    if (!data.files || data.files.length === 0 || !data.files.some((f: any) => f.sheets?.length > 0)) {
      throw new Error(
        data.message || "No readable sheets or valid rows found in the uploaded file.",
      );
    }

    console.log(
      "FlashBuzz analysis:",
      data,
    );

    localStorage.setItem(
      "flashbuzz_analysis",
      JSON.stringify(data),
    );

    go("prepare");
  } catch (err) {
    console.error(
      "Upload analysis error:",
      err,
    );

    setError(
      err instanceof Error
        ? err.message
        : "Unable to analyze files.",
    );
  }
};

const fileInputRef = useRef<HTMLInputElement | null>(null);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const allowedTypes = [
    "text/csv",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const allowedExtensions = [".csv", ".pdf", ".xlsx", ".xls"];

  const addFiles = (selectedFiles: File[]) => {
    setError("");

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      const lowerName = file.name.toLowerCase();

      const hasValidExtension = allowedExtensions.some((extension) =>
        lowerName.endsWith(extension),
      );

      const hasValidType =
        allowedTypes.includes(file.type) ||
        hasValidExtension;

      if (!hasValidType) {
        setError(
          `"${file.name}" is not supported. Please upload CSV, Excel, or PDF files.`,
        );
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `"${file.name}" is larger than 25 MB.`,
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFiles((currentFiles) => {
        const existingNames = new Set(
          currentFiles.map((file) => file.name),
        );

        const newFiles = validFiles.filter(
          (file) => !existingNames.has(file.name),
        );

        return [...currentFiles, ...newFiles];
      });
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files || [],
    );

    addFiles(selectedFiles);

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setDrag(false);

    const droppedFiles = Array.from(
      event.dataTransfer.files,
    );

    addFiles(droppedFiles);
  };

  const removeFile = (fileName: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter(
        (file) => file.name !== fileName,
      ),
    );
  };

  const removeAllFiles = () => {
    setFiles([]);
    setError("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileType = (file: File) => {
    const name = file.name.toLowerCase();

    if (name.endsWith(".csv")) {
      return "CSV file";
    }

    if (name.endsWith(".pdf")) {
      return "PDF document";
    }

    return "Excel spreadsheet";
  };

  return (
    <div className="app-shell soft-bg">
      <header className="simple-header">
        <BackButton onClick={() => go("landing")} />

        <Brand />

        <div className="stepper">
          <span className="active">1</span>
          <b>Upload data</b>

          <i></i>

          <span>2</span>
          <b>AI analysis</b>

          <i></i>

          <span>3</span>
          <b>Insights</b>
        </div>

        <button
          className="icon-btn"
          onClick={() => go("landing")}
        >
          <Icon name="close" />
        </button>
      </header>

      <main className="upload-main">
        <div className="page-kicker">
          STEP 1 OF 3
        </div>

        <h1>
          Let’s understand your business.
        </h1>

        <p>
          Upload the files you already use. FlashBuzz
          will connect the dots across sales,
          customers, and marketing.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.pdf,.xlsx,.xls"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <div
          className={`dropzone ${drag ? "dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <div className="upload-orbit">
            <Icon name="upload" size={28} />
          </div>

          <h2>
            {drag
              ? "Release to upload"
              : "Drop your business files here"}
          </h2>

          <p>
            Excel, CSV, or PDF up to 25 MB each
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            Browse files
          </Button>
        </div>

        {error && (
          <div
            style={{
              marginTop: "14px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(188, 71, 73, 0.08)",
              border: "1px solid rgba(188, 71, 73, 0.25)",
              color: "#bc4749",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {files.length > 0 ? (
          <div className="files-section fade-up">
            <div className="section-title">
              <span>
                Uploaded files{" "}
                <b>{files.length}</b>
              </span>

              <button onClick={removeAllFiles}>
                Remove all
              </button>
            </div>

            {files.map((file) => (
              <div
                className="file-row"
                key={`${file.name}-${file.lastModified}`}
              >
                <span className="file-icon">
                  <Icon name="file" />
                </span>

                <div>
                  <b>{file.name}</b>

                  <small>
                    {getFileType(file)} ·{" "}
                    {formatFileSize(file.size)}
                  </small>
                </div>

                <span className="ready">
                  <Icon name="check" size={13} />
                  Ready
                </span>

                <button
                  title="Remove file"
                  onClick={() =>
                    removeFile(file.name)
                  }
                >
                  <Icon name="close" />
                </button>
              </div>
            ))}

            <Button
  className="analyze-btn"
  onClick={analyzeFiles}
>
  <Icon name="spark" />
  Analyze My Business
  <Icon name="arrow" />
</Button>
          </div>
        ) : (
          <div className="upload-hints">
            <span>
              <Icon name="wallet" />
              Sales & revenue
            </span>

            <span>
              <Icon name="users" />
              Customer data
            </span>

            <span>
              <Icon name="chart" />
              Marketing performance
            </span>
          </div>
        )}
      </main>

      {files.length > 0 && (
        <Toast
          text={`${files.length} file${
            files.length === 1 ? "" : "s"
          } selected successfully`}
        />
      )}
    </div>
  );
}


function PrepareData({ go }: { go: (s: Screen) => void }) {
  const analysisData = (() => {
    try {
      const saved = localStorage.getItem("flashbuzz_analysis");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const sheets =
    analysisData?.files?.flatMap(
      (file: any) => file?.sheets || [],
    ) || [];

  const [selectedSheet, setSelectedSheet] = useState(0);

  const sheet = sheets[selectedSheet];
  
  const inspection = sheet?.inspection || {};
  const cleaningSummary = sheet?.cleaningSummary || {};

  const inspectionColumns = Array.isArray(inspection.columns)
    ? inspection.columns
    : [];

  const missingCells = inspectionColumns.reduce(
    (total: number, column: any) =>
      total + Number(column.missingCount ?? column.missing ?? 0),
    0,
  );

  const duplicateRows = Number(
    inspection.duplicateRows ??
      inspection.duplicates ??
      cleaningSummary.duplicateRowsRemoved ??
      0,
  );

  const emptyRows = Number(
    inspection.emptyRows ??
      cleaningSummary.emptyRowsRemoved ??
      cleaningSummary.emptyRowsRemovedCount ??
      0,
  );

  const rows: any[] = Array.isArray(sheet?.preview)
    ? sheet.preview
    : [];

  const columns =
    rows.length > 0 && rows[0] && typeof rows[0] === "object"
      ? Object.keys(rows[0])
      : Array.isArray(sheet?.analysis?.columns)
        ? sheet.analysis.columns.map((column: any) =>
            typeof column === "string" ? column : column.name,
          ).filter(Boolean)
        : [];

  const rowCount = Number(
    sheet?.analysis?.rowCount ??
      sheet?.analysis?.rows ??
      sheet?.analysis?.recordCount ??
      0,
  );

  const columnCount = Number(
    sheet?.analysis?.columnCount ??
      sheet?.analysis?.columns?.length ??
      columns.length,
  );

  return (
    <div className="processing-page">
      <BackButton onClick={() => go("upload")} />
      <Brand />

      <main
        style={{
          width: "min(1100px, 92%)",
          margin: "30px auto 60px",
        }}
      >
        <div className="page-kicker">FLASHBUZZ DATA PREPARATION</div>

        <h1>Prepare your data</h1>

        <p>
          Review your uploaded dataset before running business analysis.
        </p>

        {!sheet ? (
          <div
            style={{
              padding: 24,
              border: "1px solid var(--border, #ddd)",
              borderRadius: 14,
              marginTop: 24,
            }}
          >
            <h3>No dataset preview available</h3>
            <p>
              Upload a supported dataset again to continue.
            </p>
            <button onClick={() => go("upload")}>
              Back to Upload
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 14,
                margin: "24px 0",
              }}
            >
{[
  {
    label: "Total sheets",
    value: sheets.length,
  },
  {
    label: "Rows in selected sheet",
    value: rowCount || "Not reported",
  },
  {
    label: "Columns",
    value: columnCount || "Not reported",
  },
  {
    label: "Preview records",
    value: rows.length,
  },
].map((item) => (
  <div
    key={item.label}
    style={{
      padding: 20,
      border: "1px solid var(--border, #ddd)",
      borderRadius: 14,
    }}
  >
    <p style={{ margin: "0 0 8px", opacity: 0.7 }}>
      {item.label}
    </p>
    <h2 style={{ margin: 0 }}>
      {typeof item.value === "number"
        ? item.value.toLocaleString()
        : item.value}
    </h2>
  </div>
))}
            </div>

            {sheets.length > 1 && (
              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="prepare-sheet"
                  style={{ display: "block", marginBottom: 8 }}
                >
                  Select sheet
                </label>

                <select
                  id="prepare-sheet"
                  value={selectedSheet}
                  onChange={(event) =>
                    setSelectedSheet(Number(event.target.value))
                  }
                  style={{
                    padding: 10,
                    maxWidth: "100%",
                    borderRadius: 8,
                  }}
                >
                  {sheets.map((item: any, index: number) => (
                    <option key={index} value={index}>
                      {item.name || `Sheet ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div
              style={{
                border: "1px solid var(--border, #ddd)",
                borderRadius: 14,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <h3>
                Dataset preview — {sheet.name || "Uploaded sheet"}
              </h3>

              {rows.length > 0 && columns.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr>
                        {columns.map((column: string) => (
                          <th
                            key={column}
                            style={{
                              padding: 10,
                              borderBottom: "1px solid var(--border, #ddd)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {rows.slice(0, 10).map((row: any, index: number) => (
                        <tr key={index}>
                          {columns.map((column: string) => (
                            <td
                              key={column}
                              style={{
                                padding: 10,
                                borderBottom:
                                  "1px solid var(--border, #ddd)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row[column] == null || row[column] === ""
                                ? "—"
                                : String(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>
                  The backend did not provide preview rows for this sheet.
                  Check the upload response before continuing.
                </p>
              )}

              <p style={{ opacity: 0.7, marginBottom: 0 }}>
                Showing up to 10 preview records. The full dataset is not
                displayed here.
              </p>
            </div>

              
            {/* Column Profile */}
            <div
              style={{
                border: "1px solid var(--border, #ddd)",
                borderRadius: 14,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <h3>Column Profile</h3>
              <p style={{ opacity: 0.7 }}>
                Detected data types and missing values in each column.
              </p>

              {inspectionColumns.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr>
                        {["Column Name", "Detected Type", "Missing Values", "Missing %"].map(
                          (heading) => (
                            <th
                              key={heading}
                              style={{
                                padding: 12,
                                borderBottom: "1px solid var(--border, #ddd)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {inspectionColumns.map((column: any) => (
                        <tr key={column.name}>
                          <td
                            style={{
                              padding: 12,
                              borderBottom: "1px solid var(--border, #ddd)",
                            }}
                          >
                            {column.name}
                          </td>
                          <td style={{ padding: 12 }}>
                            {column.detectedType || "Unknown"}
                          </td>
                          <td style={{ padding: 12 }}>
                            {Number(column.missingValues ?? 0).toLocaleString()}
                          </td>
                          <td style={{ padding: 12 }}>
                            {Number(column.missingPercentage ?? 0).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>
                  Column profile is unavailable. Check whether the backend
                  returns inspection data for this sheet.
                </p>
              )}
            </div>


            <div className="prepare-actions">
              <Button
                variant="secondary"
                onClick={() => go("upload")}
                className="prepare-back-btn"
                aria-label="Back to Upload"
              >
                <Icon name="arrow-left" size={16} />
                Back to Upload
              </Button>

              <Button
                variant="primary"
                onClick={() => go("processing")}
                className="prepare-continue-btn"
                aria-label="Continue to Analysis"
              >
                Continue to Analysis
                <Icon name="arrow" size={16} />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}


const processingSteps = [
  "Files received",
  "Understanding business data",
  "Calculating business metrics",
  "Detecting unusual patterns",
  "Finding root causes",
  "Predicting future outcomes",
  "Generating recommendations",
];

function Processing({ go }: { go: (s: Screen) => void }) {
  const [step, setStep] = useState(0);

  const analysisData = (() => {
    try {
      const saved = localStorage.getItem("flashbuzz_analysis");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const sheets =
    analysisData?.files?.flatMap(
      (file: any) => file?.sheets || [],
    ) || [];

  const totalRows = sheets.reduce(
    (total: number, sheet: any) =>
      total +
      Number(
        sheet?.analysis?.rowCount ??
          sheet?.analysis?.rows ??
          sheet?.analysis?.recordCount ??
          0,
      ),
    0,
  );

  const totalColumns = sheets.reduce(
    (total: number, sheet: any) =>
      total +
      Number(
        sheet?.analysis?.columnCount ??
          sheet?.analysis?.columns?.length ??
          0,
      ),
    0,
  );

  const totalDataPoints =
    totalRows > 0 && totalColumns > 0
      ? totalRows * totalColumns
      : 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((v) => {
        if (v >= processingSteps.length - 1) {
          window.clearInterval(timer);

          window.setTimeout(() => go("complete"), 700);

          return v;
        }

        return v + 1;
      });
    }, 650);

    return () => window.clearInterval(timer);
  }, [go]);

  const dataDescription =
    totalDataPoints > 0
      ? `Connecting patterns across ${totalDataPoints.toLocaleString()} data points`
      : totalRows > 0
        ? `Analyzing ${totalRows.toLocaleString()} records from your dataset`
        : "Understanding the structure of your business data";

  return (
    <div className="processing-page">
      <BackButton onClick={() => go("upload")} />

      <Brand />

      <div className="processing-core">
        <div className="ai-orb">
          <span>
            <Icon name="bolt" size={31} />
          </span>
        </div>

        <div className="page-kicker">FLASHBUZZ AI</div>

        <h1>Analyzing your business</h1>

        <p>{dataDescription}</p>

        {totalRows > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              marginTop: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <span>
              <b>{totalRows.toLocaleString()}</b> records
            </span>

            {totalColumns > 0 && (
              <span>
                <b>{totalColumns.toLocaleString()}</b> columns
              </span>
            )}

            {sheets.length > 0 && (
              <span>
                <b>{sheets.length}</b>{" "}
                {sheets.length === 1 ? "sheet" : "sheets"}
              </span>
            )}
          </div>
        )}

        <div className="process-list">
          {processingSteps.map((label, i) => (
            <div
              className={`process-step ${i === step ? "current" : ""} ${
                i < step ? "done" : ""
              }`}
              key={label}
            >
              <span>
                {i < step ? (
                  <Icon name="check" size={14} />
                ) : i === step ? (
                  <i className="loader"></i>
                ) : (
                  ""
                )}
              </span>

              <b>{label}</b>

              {i < step && <small>Complete</small>}
            </div>
          ))}
        </div>

        <div className="progress-track">
          <span
            style={{
              width: `${((step + 1) / processingSteps.length) * 100}%`,
            }}
          ></span>
        </div>

        <small className="secure-note">
          Your data is encrypted and never shared.
        </small>
      </div>
    </div>
  );
}


function Complete({ go }: { go: (s: Screen) => void }) {
  const analysisData = getAnalysisData();

  const sheets =
    analysisData?.files?.flatMap(
      (file: any) => file?.sheets || [],
    ) || [];

  const salesAnalyses = sheets
    .map((sheet: any) => sheet?.analysis?.salesAnalysis)
    .filter(Boolean);

  const analyses = salesAnalyses.length > 0
    ? salesAnalyses
    : sheets.map((sheet: any) => sheet?.analysis).filter(Boolean);

  const insights = (salesAnalyses.length > 0 ? salesAnalyses : analyses).flatMap(
    (analysis: any) => analysis.insights || [],
  );

  const criticalProblems = insights.filter(
    (insight: any) => insight.type === "loss" || insight.severity === "high" || insight.severity === "critical",
  ).length;

  const growthInsights = insights.filter(
    (insight: any) =>
      insight.type === "product" ||
      insight.type === "region" ||
      insight.type === "opportunity",
  ).length;

  const totalInsights = insights.length;

  const formatCurrency = (value: number) => {
    if (!Number.isFinite(value)) return "Unavailable";

    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    }

    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    }

    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const totalSales = salesAnalyses.reduce(
    (total: number, analysis: any) =>
      total + (Number(analysis.totalSales) || 0),
    0,
  );

  const hasAnalysis = analyses.length > 0;

  return (
    <div className="complete-page">
      <BackButton onClick={() => go("upload")} />

      <Brand />

      <div className="complete-card fade-up">
        <div className="complete-check">
          <Icon name="check" size={34} />
        </div>

        <div className="page-kicker">ANALYSIS COMPLETE</div>

        <h1>
          {hasAnalysis
            ? "Your business analysis is ready."
            : "Analysis results are unavailable."}
        </h1>

        <p>
          {hasAnalysis ? (
            <>
              FlashBuzz analyzed your uploaded data and found{" "}
              <b>
                {totalInsights} data insight
                {totalInsights === 1 ? "" : "s"}
              </b>
              .
            </>
          ) : (
            "Upload and analyze a supported CSV or Excel sales dataset to see your results."
          )}
        </p>

        <div className="complete-stats">
          <div>
            <span className="problem-dot"></span>
            <b>{hasAnalysis ? criticalProblems : "—"}</b>
            <small>Loss-related findings</small>
          </div>

          <div>
            <span className="opportunity-dot"></span>
            <b>{hasAnalysis ? growthInsights : "—"}</b>
            <small>Product and region insights</small>
          </div>

          <div>
            <Icon name="trend" />
            <b>
              {hasAnalysis && salesAnalyses.length > 0
                ? formatCurrency(totalSales)
                : hasAnalysis
                  ? `${sheets[0]?.analysis?.rowCount || 0} rows`
                  : "Unavailable"}
            </b>
            <small>Total sales analyzed</small>
          </div>
        </div>

        <Button
          onClick={() =>
            go(hasAnalysis ? "dashboard" : "upload")
          }
        >
          {hasAnalysis ? "View All Insights" : "Upload Business Data"}
          <Icon name="arrow" />
        </Button>
      </div>

      <Toast
        text={
          hasAnalysis
            ? "Analysis results loaded"
            : "No analysis results found"
        }
        warning={!hasAnalysis}
      />
    </div>
  );
}


/* =========================================================
   PROFILE
========================================================= */

function Profile({
  go,
  theme,
  setTheme,
}: {
  go: (s: Screen) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  const user = getStoredUser();

  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(
    user?.business_name || ""
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="app-shell soft-bg">
        <div style={{ padding: "40px" }}>
          <h1>Profile</h1>
          <p>Please log in again.</p>

          <Button onClick={() => go("login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const token =
      localStorage.getItem("flashbuzz_token") ||
      sessionStorage.getItem("flashbuzz_token");

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            business_name: businessName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update your profile."
        );
        return;
      }

      const storage =
        localStorage.getItem("flashbuzz_token")
          ? localStorage
          : sessionStorage;

      storage.setItem(
        "flashbuzz_user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Profile updated successfully!"
      );

      setTimeout(() => {
        go("dashboard");
      }, 700);

    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        "Unable to connect to FlashBuzz."
      );

    } finally {
      setSaving(false);
    }
  };

  const initials = getInitials(name);

  return (
    <div className="app-shell soft-bg">

      <header className="simple-header">

        <BackButton
          onClick={() => go("dashboard")}
          label="Back"
        />

        <Brand />

        <div></div>

      </header>

      <main
        style={{
          width: "min(720px, calc(100% - 40px))",
          margin: "0 auto",
          padding: "60px 0 80px",
        }}
      >

        <div className="page-kicker">
          ACCOUNT
        </div>

        <h1
          style={{
            margin: "8px 0 10px",
            fontSize: "36px",
          }}
        >
          Your Profile
        </h1>

        <p
          style={{
            color: "#68736d",
            marginBottom: "30px",
          }}
        >
          Manage your personal and business information.
        </p>

        <section
          className="panel"
          style={{
            padding: "32px",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "32px",
            }}
          >

            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#e8f1d7",
                color: "#386641",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              {initials}
            </div>

            <div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                }}
              >
                {name || "Your Name"}
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#68736d",
                }}
              >
                {user.email}
              </p>

            </div>

          </div>

          {error && (
            <div
              className="auth-error"
              style={{
                marginBottom: "20px",
              }}
            >
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                borderRadius: "10px",
                background:
                  "rgba(106, 153, 78, 0.10)",
                color: "#386641",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              ✓ {message}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1f2a24",
              }}
            >
              Full name

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your full name"
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 14px",
                  border: "1px solid #d9d7cd",
                  borderRadius: "10px",
                  outline: "none",
                  background: "#fff",
                  color: "#1f2a24",
                  font: "inherit",
                  boxSizing: "border-box",
                }}
              />

            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1f2a24",
              }}
            >
              Shop / Business name

              <input
                type="text"
                value={businessName}
                onChange={(e) =>
                  setBusinessName(e.target.value)
                }
                placeholder="Your business name"
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 14px",
                  border: "1px solid #d9d7cd",
                  borderRadius: "10px",
                  outline: "none",
                  background: "#fff",
                  color: "#1f2a24",
                  font: "inherit",
                  boxSizing: "border-box",
                }}
              />

            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1f2a24",
              }}
            >
              Email address

              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 14px",
                  border: "1px solid #d9d7cd",
                  borderRadius: "10px",
                  outline: "none",
                  background: "#f3f2ed",
                  color: "#68736d",
                  font: "inherit",
                  boxSizing: "border-box",
                  opacity: 0.8,
                }}
              />

              <small
                style={{
                  color: "#8a918c",
                  fontWeight: 400,
                }}
              >
                Email cannot be changed here.
              </small>

            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "8px",
              }}
            >

              <Button
                variant="secondary"
                onClick={() => go("dashboard")}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </Button>

            </div>

          </div>

        </section>

                <section
          className="panel"
          style={{
            padding: "32px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <div className="page-kicker">SETTINGS</div>

            <h2
              style={{
                margin: "8px 0 6px",
                fontSize: "22px",
              }}
            >
              Account Settings
            </h2>

            <p
              style={{
                margin: 0,
                color: "#68736d",
                fontSize: "14px",
              }}
            >
              Manage your FlashBuzz account preferences.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                alert("Notification settings will be available soon.")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "16px",
                border: "1px solid #e4e0d4",
                borderRadius: "12px",
                background: "#fff",
                color: "#1f2a24",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <b>Notifications</b>
                <div
                  style={{
                    marginTop: "4px",
                    color: "#68736d",
                    fontSize: "13px",
                  }}
                >
                  Manage your FlashBuzz notifications
                </div>
              </div>

              <Icon name="chevron" />
            </button>

            <button
              type="button"
              onClick={() =>
                alert("Security settings will be available soon.")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "16px",
                border: "1px solid #e4e0d4",
                borderRadius: "12px",
                background: "#fff",
                color: "#1f2a24",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <b>Security</b>
                <div
                  style={{
                    marginTop: "4px",
                    color: "#68736d",
                    fontSize: "13px",
                  }}
                >
                  Manage password and account security
                </div>
              </div>

              <Icon name="chevron" />
            </button>

                        <button
              type="button"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "16px",
                border: "1px solid #e4e0d4",
                borderRadius: "12px",
                background: "#fff",
                color: "#1f2a24",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>
                <b>Appearance</b>

                <div
                  style={{
                    marginTop: "4px",
                    color: "#68736d",
                    fontSize: "13px",
                  }}
                >
                  {theme === "dark"
                    ? "Dark mode is enabled"
                    : "Light mode is enabled"}
                </div>
              </div>

              <span
                style={{
                  padding: "7px 12px",
                  borderRadius: "20px",
                  background:
                    theme === "dark"
                      ? "#386641"
                      : "#e8f1d7",
                  color:
                    theme === "dark"
                      ? "#fff"
                      : "#386641",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>
          </div>
        </section>

      </main>

    </div>
  );
}

function Sidebar({
  screen,
  go,
}: {
  screen: Screen;
  go: (s: Screen) => void;
}) {
  const user = getStoredUser();

  const userName = user?.name || "User";

  const businessName =
    user?.business_name || "Your Business";

  const initials = getInitials(userName);

  return (
    <aside className="sidebar">

      <div
        onClick={() => go("dashboard")}
        style={{ cursor: "pointer" }}
      >
        <Brand light />
      </div>

      <div className="workspace">
        <span>{initials}</span>

        <div>
          <small>WORKSPACE</small>
          <b>{businessName}</b>
        </div>

        <Icon name="chevron" />
      </div>

      <nav>

        <button
          className={
            screen === "dashboard"
              ? "active"
              : ""
          }
          onClick={() => go("dashboard")}
        >
          <Icon name="chart" />
          Overview
        </button>

        <button>
          <Icon name="spark" />
          AI Insights <em>4</em>
        </button>

        <button onClick={() => go("chat")}>
          <Icon name="send" />
          Ask FlashBuzz
        </button>

        <button>
          <Icon name="target" />
          Action Plans
        </button>

        <button onClick={() => go("impact")}>
          <Icon name="trend" />
          Business Impact
        </button>

      </nav>

      <div className="sidebar-bottom">

        <div className="data-status">
          <span></span>

          <div>
            <b>Data connected</b>
            <small>3 files · Updated now</small>
          </div>
        </div>

        <div
          className="profile"
          onClick={() => go("profile")}
          style={{ cursor: "pointer" }}
        >
          <span>{initials}</span>

          <div>
            <b>{userName}</b>
            <small>Business owner</small>
          </div>

          <Icon name="chevron" />
        </div>

      </div>

    </aside>
  );
}

const getAnalysisData = () => {
  try {
    const saved = localStorage.getItem("flashbuzz_analysis");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const formatMetricValue = (value: number) => {
  if (!Number.isFinite(value)) return "—";

  if (Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }

  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }

  if (Math.abs(value) >= 1000) {
    return value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  }

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};



const getAnalysisSummary = () => {
  const data = getAnalysisData();

  const sheets =
    data?.files?.flatMap((file: any) => file?.sheets || []) || [];

  const sheet = sheets.find(
    (item: any) => item?.analysis
  );

  const salesKpis = (sheet?.analysis?.salesAnalysis?.kpis || []).filter(
    (kpi: any) => kpi.value !== null && kpi.value !== undefined && kpi.type !== "unavailable"
  );

  const kpis = salesKpis.length > 0 ? salesKpis : (sheet?.analysis?.kpis || []);

  const iconMap: Record<string, IconName> = {
    total_sales: "wallet",
    gross_sales: "chart",
    total_discount: "alert",
    total_quantity: "target",
    total_orders: "file",
    average_order_value: "trend",
    profit: "wallet",
    profit_margin: "trend",
    total_records: "users",
    total_columns: "chart",
    duplicate_records: "alert",
    missing_cells: "alert",
  };

  return kpis.map((kpi: any) => {
    const label = String(kpi.label || kpi.id || "Metric");
    const rawValue = kpi.value;

    let value = "Unavailable";

    if (
      rawValue !== null &&
      rawValue !== undefined &&
      !(typeof rawValue === "number" && !Number.isFinite(rawValue))
    ) {
      if (kpi.type === "currency" && typeof rawValue === "number") {
        value = formatMetricValue(rawValue);
      } else if (typeof rawValue === "number") {
        value = rawValue.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        });
      } else {
        value = String(rawValue);
      }
    }

    return {
      title: label,
      value,
      note: kpi.sourceColumn
        ? `Calculated from ${kpi.sourceColumn}`
        : "Calculated from uploaded data",
      icon: iconMap[kpi.id] || "chart",
      change: "Uploaded data",
    };
  });
};


function Dashboard({ go }: { go: (s: Screen) => void }) {
  const [range, setRange] = useState("30D");
  const analysisData = getAnalysisData();
  const kpis = getAnalysisSummary();

  const sheets =
    analysisData?.files?.flatMap((file: any) => file?.sheets || []) || [];

  const salesAnalysis = sheets.find(
    (s: any) => s?.analysis?.salesAnalysis,
  )?.analysis?.salesAnalysis;

  const activeInsights =
    salesAnalysis?.insights || sheets[0]?.analysis?.insights || [];

  console.log("FLASHBUZZ SAVED DATA:", analysisData);
  console.log("FLASHBUZZ KPI RESULTS:", kpis);

  return (

    <div className="dashboard-layout">
      <Sidebar screen="dashboard" go={go} />

      <main className="dashboard-main">
        <header className="dash-header">
          <div>
           <h1>
  Good morning, {getStoredUser()?.name || "there"}.
</h1>

            <p>Here’s what’s happening in your business.</p>
          </div>

          <div className="header-actions">
            <BackButton onClick={() => go("landing")} label="Home" />

            <button className="date-button">
              <Icon name="calendar" />
              Jun 1 – Jun 30
              <Icon name="chevron" />
            </button>

            <button className="icon-btn notification">
              <Icon name="alert" />
              <span></span>
            </button>
<button
  className="avatar"
  onClick={() => go("profile")}
  style={{ cursor: "pointer", border: "none" }}
>
  {getInitials(getStoredUser()?.name || "User")}
</button>
          </div>
        </header>

        <section className="ai-brief">
          <span className="brief-icon">
            <Icon name="bolt" />
          </span>

          <div>
            <small>FLASHBUZZ DAILY BRIEF</small>

            <b>
              {salesAnalysis
                ? `Total sales analyzed: ${formatMetricValue(salesAnalysis.totalSales)} across ${salesAnalysis.totalOrders || salesAnalysis.rowCount} orders.`
                : sheets[0]?.analysis?.rowCount
                  ? `Analyzed ${sheets[0].analysis.rowCount.toLocaleString("en-IN")} rows from your uploaded dataset.`
                  : "Here’s what’s happening in your business."}
            </b>

            <p>
              {activeInsights.length > 0
                ? activeInsights.map((i: any) => i.message || i.description).slice(0, 2).join(" ")
                : "Explore your business metrics and trends below."}
            </p>
          </div>

          <Button variant="secondary" onClick={() => go("root")}>
            Review insights <Icon name="arrow" />
          </Button>
        </section>

        <section className="kpi-grid">
    {kpis.map((k: any) => (
    <button
      className="kpi-card"
      key={k.title}
      onClick={() => go("root")}
    >
              <span className="kpi-icon">
                <Icon name={k.icon} />
              </span>

              <small>{k.title}</small>

              <b>{k.value}</b>

              <em className={k.change.startsWith("-") ? "negative" : ""}>
                {k.change}
              </em>

              <div className="kpi-extra">
                {k.note} <Icon name="arrow" size={14} />
              </div>
            </button>
          ))}
        </section>

        <div className="dashboard-grid">
          <section className="panel chart-panel">
            <div className="panel-head">
              <div>
                <h2>Revenue performance</h2>

                <p>Revenue vs previous period</p>
              </div>

              <div className="filters">
                {["7D", "30D", "3M", "6M", "1Y"].map((r) => (
                  <button
                    className={range === r ? "active" : ""}
                    onClick={() => setRange(r)}
                    key={r}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

<div className="chart-summary">
  <b>
    {kpis.find(
      (k: any) =>
        k.title?.toLowerCase().includes("total sales") ||
        k.title?.toLowerCase().includes("total revenue")
    )?.value || "No sales data"}
  </b>

              <span>+12.4% vs previous period</span>
            </div>

            <div className={`line-chart range-${range.toLowerCase()}`}>
              <div className="grid-lines">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>

              <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6A994E" stopOpacity=".22" />

                    <stop offset="100%" stopColor="#6A994E" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  className="area"
                  d="M0 145 C55 130 72 100 120 112 S190 142 240 94 S315 88 360 78 S430 110 475 55 S548 52 600 22 L600 180 L0 180Z"
                />

                <path
                  className="line"
                  d="M0 145 C55 130 72 100 120 112 S190 142 240 94 S315 88 360 78 S430 110 475 55 S548 52 600 22"
                />

                <g className="points">
                  {[
                    ["0", "145"],
                    ["120", "112"],
                    ["240", "94"],
                    ["360", "78"],
                    ["475", "55"],
                    ["600", "22"],
                  ].map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r="5">
                      <title>₹{62 + i * 4}.2L revenue</title>
                    </circle>
                  ))}
                </g>
              </svg>

              <div className="chart-labels">
                <span>Jun 1</span>
                <span>Jun 7</span>
                <span>Jun 14</span>
                <span>Jun 21</span>
                <span>Jun 30</span>
              </div>
            </div>
          </section>

          <section className="panel insight-panel">
            <div className="panel-head">
              <div>
                <h2>AI-detected problems</h2>

                <p>Ranked by business impact</p>
              </div>

              <span className="count-badge">2 new</span>
            </div>

            <button className="problem-card" onClick={() => go("root")}>
              <span className="severity high">HIGH</span>

              <div className="problem-icon">
                <Icon name="trend" />
              </div>

              <h3>{activeInsights[0]?.title || "Sales & product performance analyzed"}</h3>

              <p>
                {activeInsights[0]?.message || activeInsights[0]?.description || "Calculated from your uploaded sales records."}
              </p>

              <div className="impact-line">
                <span>{salesAnalysis ? "Top Category" : "Status"}</span>

                <b>{salesAnalysis?.categories?.[0]?.name || "Active"}</b>
              </div>

              <div className="open-row">
                View sales breakdown <Icon name="arrow" size={15} />
              </div>
            </button>

            <button className="mini-problem" onClick={() => go("root")}>
              <span className="severity medium">MEDIUM</span>

              <div>
                <b>{activeInsights[1]?.title || "Regional breakdown"}</b>

                <small>{activeInsights[1]?.message || "Explore region details"}</small>
              </div>

              <Icon name="chevron" />
            </button>
          </section>
        </div>
      </main>

      <Toast text="New business problem detected" warning />
    </div>
  );
}


function RootCause({ go }: { go: (s: Screen) => void }) {
  const [selected, setSelected] = useState(0);

  const analysisData = getAnalysisData();

  const sheets =
    analysisData?.files?.flatMap(
      (file: any) => file?.sheets || [],
    ) || [];

  const analyses = sheets
    .map((sheet: any) => sheet?.analysis?.salesAnalysis)
    .filter(Boolean);

  const sales = analyses[0];

  const nodes = sales
    ? [
        {
          label: "Overall sales",
          value: formatMetricValue(Number(sales.totalSales) || 0),
          detail: `Total recorded sales across ${Number(sales.rowCount) || 0} valid sales rows in the uploaded dataset.`,
          evidence: `${Number(sales.rowCount) || 0} valid sales rows`,
        },
        ...(sales.categories || []).slice(0, 1).map((item: any) => ({
          label: `Category: ${item.name}`,
          value: formatMetricValue(Number(item.sales) || 0),
          detail: `${item.name} recorded ${formatMetricValue(Number(item.sales) || 0)} in sales.`,
          evidence: `${Number(item.quantity) || 0} units recorded`,
        })),
        ...(sales.products || []).slice(0, 1).map((item: any) => ({
          label: `Product: ${item.name}`,
          value: formatMetricValue(Number(item.sales) || 0),
          detail: `${item.name} recorded ${formatMetricValue(Number(item.sales) || 0)} in sales.`,
          evidence: `${Number(item.quantity) || 0} units recorded`,
        })),
        ...(sales.regions || []).slice(0, 1).map((item: any) => ({
          label: `Region: ${item.name}`,
          value: formatMetricValue(Number(item.sales) || 0),
          detail: `${item.name} recorded ${formatMetricValue(Number(item.sales) || 0)} in sales.`,
          evidence: `${Number(item.orderCount) || 0} distinct orders recorded`,
        })),
      ]
    : [];

  const safeSelected = Math.min(selected, Math.max(nodes.length - 1, 0));
  const node = nodes[safeSelected];

  return (
    <div className="dashboard-layout">
      <Sidebar screen="root" go={go} />

      <main className="dashboard-main root-main">
        <header className="inner-header">
          <div className="inner-header-top">
            <BackButton onClick={() => go("dashboard")} label="Back to insights" />

            <span className="severity high">
              {sales ? "DATA ANALYSIS" : "NO DATA"}
            </span>
          </div>

          <h1>
            {sales
              ? "Explore your sales drivers"
              : "Upload data to explore your business"}
          </h1>

          <p>
            {sales
              ? `FlashBuzz found ${nodes.length} data views from your uploaded sales analysis.`
              : "No sales analysis was found. Upload a CSV or Excel sales dataset and run the analysis first."}
          </p>
        </header>

        {sales && node ? (
          <div className="root-layout">
            <section className="panel root-map">
              <div className="panel-head">
                <div>
                  <h2>Sales breakdown</h2>
                  <p>Select a factor to explore its recorded sales</p>
                </div>

                <div className="confidence">
                  <span></span>
                  Based on uploaded data
                </div>
              </div>

              <div className="cause-flow">
                {nodes.map((item: any, i: number) => (
                  <div key={`${item.label}-${i}`} className="flow-wrap">
                    <button
                      onClick={() => setSelected(i)}
                      className={`cause-node ${
                        safeSelected === i ? "selected" : ""
                      }`}
                    >
                      <span>{i + 1}</span>

                      <div>
                        <small>{item.label}</small>
                        <b>{item.value}</b>
                      </div>

                      <Icon name="chevron" />
                    </button>

                    {i < nodes.length - 1 && (
                      <div className="flow-arrow">
                        ↓
                        <small>Sales breakdown</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <aside className="cause-panel fade-in" key={node.label}>
              <div className="cause-panel-top">
                <span className="cause-num">
                  {String(safeSelected + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="page-kicker">SELECTED DATA VIEW</div>

              <h2>{node.label}</h2>

              <p>{node.detail}</p>

              <div className="detail-grid">
                <div>
                  <small>RECORDED SALES</small>
                  <b>{node.value}</b>
                </div>

                <div>
                  <small>DATA SOURCE</small>
                  <b>Uploaded dataset</b>
                </div>

                <div>
                  <small>VALID ROWS</small>
                  <b>{Number(sales.rowCount) || 0}</b>
                </div>

                <div>
                  <small>PROFIT STATUS</small>
                  <b>
                    {sales.profitAvailable
                      ? "Available"
                      : "Cost data missing"}
                  </b>
                </div>
              </div>

              <div className="evidence-box">
                <small>AVAILABLE EVIDENCE</small>

                <ul>
                  <li>{node.evidence}</li>
                  <li>
                    Total sales:{" "}
                    {formatMetricValue(Number(sales.totalSales) || 0)}
                  </li>
                  <li>
                    {sales.profitAvailable
                      ? `Calculated profit/loss: ${formatMetricValue(Number(sales.totalProfit) || 0)}`
                      : "Profit or loss cannot be verified without complete cost data."}
                  </li>
                </ul>
              </div>

              <div className="recommendation-mini">
                <Icon name="spark" />

                <div>
                  <small>ANALYSIS NOTE</small>
                  <b>
                    Use this breakdown to identify high-performing areas.
                    A decline or root cause requires comparison data.
                  </b>
                </div>
              </div>

              <Button onClick={() => go("chat")}>
                Ask AI About This <Icon name="spark" />
              </Button>
            </aside>
          </div>
        ) : (
          <section className="panel" style={{ padding: "28px" }}>
            <h2>No analysis available</h2>
            <p>Upload your business dataset to populate this page.</p>
            <Button onClick={() => go("upload")}>
              Upload Data <Icon name="upload" />
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}


function Chat({ go }: { go: (s: Screen) => void }) {
  const [messages, setMessages] = useState<
    {
      from: "ai" | "user";
      text: string;
    }[]
  >([
    {
      from: "ai",
      text: "I’ve loaded the Electronics sales decline and analyzed it against your uploaded business data. What would you like to understand?",
    },
  ]);

  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);

  const send = (text = input) => {
    if (!text.trim() || typing) return;

    setMessages((m) => [
      ...m,
      {
        from: "user",
        text,
      },
    ]);

    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      setTyping(false);

      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: "Revenue fell because 284 high-value Electronics customers stopped purchasing, concentrated in the North region. This explains 72% of the decline. A focused win-back campaign is your highest-impact next step.",
        },
      ]);
    }, 1100);
  };

  const hasAnswer = messages.length > 1 && !typing;

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <Brand light />

        <button className="new-chat">＋ New conversation</button>

        <small>RECENT</small>

        <button className="history active">
          Electronics sales decline
          <span>Just now</span>
        </button>

        <button className="history">
          June performance summary
          <span>Yesterday</span>
        </button>

        <button className="history">
          Marketing ROI analysis
          <span>3 days ago</span>
        </button>

        <div className="chat-profile">
          <span>PK</span>

          <div>
            <b>Priya Kapoor</b>
            <small>FlashBuzz Pro</small>
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <Button
            variant="secondary"
            onClick={() => go("root")}
            className="chat-back-btn"
            aria-label="Back to analysis"
          >
            <Icon name="arrow-left" size={15} />
            <span className="chat-back-text">Back to analysis</span>
          </Button>

          <div className="chat-header-title">
            <span className="ai-avatar">
              <Icon name="bolt" />
            </span>

            <div>
              <b>Ask FlashBuzz</b>

              <small>
                <i></i> Business Data Connected
              </small>
            </div>
          </div>

          <button
            className="icon-btn chat-close-btn"
            onClick={() => go("root")}
            aria-label="Close chat"
            title="Close chat"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="context-bar">
          <Icon name="spark" />

          <div>
            <b>Analyzing: Electronics sales decline</b>

            <small>Using sales.xlsx, customers.csv, and marketing.csv</small>
          </div>

          <button>View context</button>
        </div>

        <div className="messages">
          {messages.map((m, i) => (
            <div className={`message ${m.from}`} key={i}>
              {m.from === "ai" && (
                <span className="ai-avatar small">
                  <Icon name="bolt" size={14} />
                </span>
              )}

              <div className="bubble">
                <small>{m.from === "ai" ? "FLASHBUZZ AI" : "YOU"}</small>

                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="message ai">
              <span className="ai-avatar small">
                <Icon name="bolt" size={14} />
              </span>

              <div className="bubble typing">
                <small>FLASHBUZZ IS ANALYZING</small>

                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {hasAnswer && (
            <div className="insight-cards fade-up">
              <button onClick={() => go("root")}>
                <span className="insight-symbol">
                  <Icon name="search" />
                </span>

                <small>ROOT CAUSE</small>

                <b>Electronics sales ↓31%</b>

                <em>
                  Explore analysis <Icon name="arrow" size={14} />
                </em>
              </button>

              <button>
                <span className="insight-symbol">
                  <Icon name="trend" />
                </span>

                <small>PREDICTION</small>

                <b>Revenue may fall another 8%</b>

                <em>
                  View forecast <Icon name="arrow" size={14} />
                </em>
              </button>

              <button className="recommended" onClick={() => go("action")}>
                <span className="insight-symbol">
                  <Icon name="spark" />
                </span>

                <small>RECOMMENDATION</small>

                <b>Target inactive customers</b>

                <em>
                  Create action plan <Icon name="arrow" size={14} />
                </em>
              </button>
            </div>
          )}
        </div>

        <div className="chat-composer">
          {messages.length === 1 && (
            <div className="suggestions">
              {[
                "Why did revenue fall?",
                "Which product should I promote?",
                "Where am I losing money?",
                "What should I do next?",
              ].map((q) => (
                <button onClick={() => send(q)} key={q}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="composer-box">
            <textarea
              placeholder="Ask anything about your business…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />

            <button className="attach">
              <Icon name="clip" />
            </button>

            <button className="send-btn" onClick={() => send()}>
              <Icon name="send" />
            </button>
          </div>

          <small>
            FlashBuzz answers using your uploaded business data. Always verify
            important decisions.
          </small>
        </div>
      </main>
    </div>
  );
}

const actionSteps = [
  "Identify inactive customers",
  "Segment high-value customers",
  "Create personalized campaign",
  "Launch win-back campaign",
  "Measure conversion",
];

function ActionPlan({ go }: { go: (s: Screen) => void }) {
  const [done, setDone] = useState<number[]>([]);

  const progress = done.length * 20;

  const toggle = (i: number) =>
    setDone((d) => (d.includes(i) ? d.filter((n) => n !== i) : [...d, i]));

  return (
    <div className="modal-page">
      <div className="action-modal">
        <header>
          <BackButton onClick={() => go("chat")} label="Back to AI chat" />

          <div className="modal-icon">
            <Icon name="target" />
          </div>

          <div>
            <div className="page-kicker">AI-GENERATED ACTION PLAN</div>

            <h1>Win back inactive Electronics customers</h1>
          </div>

          <button className="icon-btn" onClick={() => go("chat")}>
            <Icon name="close" />
          </button>
        </header>

        <div className="action-summary">
          <div>
            <small>EXPECTED IMPACT</small>

            <b>+₹7.8L revenue</b>
          </div>

          <div>
            <small>TIME TO COMPLETE</small>

            <b>7–10 days</b>
          </div>

          <div>
            <small>CONFIDENCE</small>

            <b>87%</b>
          </div>
        </div>

        <div className="progress-header">
          <div>
            <h2>Action steps</h2>

            <p>Complete each step to put this recommendation into action.</p>
          </div>

          <div className="progress-value">
            <b>{progress}%</b>

            <span>
              <i
                style={{
                  width: `${progress}%`,
                }}
              ></i>
            </span>
          </div>
        </div>

        <div className="action-list">
          {actionSteps.map((step, i) => (
            <button
              className={done.includes(i) ? "completed" : ""}
              key={step}
              onClick={() => toggle(i)}
            >
              <span className="checkbox">
                {done.includes(i) && <Icon name="check" size={15} />}
              </span>

              <span className="step-number">0{i + 1}</span>

              <div>
                <b>{step}</b>

                <small>
                  {
                    [
                      "Filter customers inactive for 45+ days with prior Electronics purchases.",
                      "Prioritize by lifetime value and purchase frequency.",
                      "Use the AI brief to personalize the return offer.",
                      "Schedule the campaign for the highest-engagement window.",
                      "Track purchases and compare against the control group.",
                    ][i]
                  }
                </small>
              </div>

              <Icon name="chevron" />
            </button>
          ))}
        </div>

        {progress === 100 ? (
          <div className="plan-complete fade-up">
            <span>
              <Icon name="check" />
            </span>

            <div>
              <b>Action Plan Completed</b>

              <small>Your projected business impact is ready to review.</small>
            </div>

            <Button onClick={() => go("impact")}>
              View business impact <Icon name="arrow" />
            </Button>
          </div>
        ) : (
          <footer>
            <span>Changes are saved automatically</span>

            <Button
              variant="secondary"
              onClick={() => setDone(actionSteps.map((_, i) => i))}
            >
              Mark all complete
            </Button>
          </footer>
        )}
      </div>

      {progress === 100 && <Toast text="Action plan completed" />}
    </div>
  );
}

function Impact({ go }: { go: (s: Screen) => void }) {
  const [view, setView] = useState<"Before" | "After" | "Impact">("Impact");

  return (
    <div className="dashboard-layout">
      <Sidebar screen="impact" go={go} />

      <main className="dashboard-main impact-main">
        <header className="dash-header">
          <div>
            <div className="page-kicker">BUSINESS IMPACT</div>

            <h1>Your decisions are driving growth.</h1>

            <p>Projected impact from the Electronics win-back action plan.</p>
          </div>

          <Button variant="secondary" onClick={() => go("dashboard")}>
            Back to overview
          </Button>
        </header>

        <section className="impact-hero">
          <div className="impact-glow"></div>

          <span className="impact-icon">
            <Icon name="trend" size={25} />
          </span>

          <small>PROJECTED REVENUE OPPORTUNITY</small>

          <h2>+₹7.8L</h2>

          <p>Potential revenue recovery over the next 60 days</p>

          <div className="confidence-pill">
            <span></span>
            87% AI confidence
          </div>
        </section>

        <section className="panel comparison">
          <div className="panel-head">
            <div>
              <h2>Before vs. after</h2>

              <p>See how this action changes your outlook</p>
            </div>

            <div className="segment">
              {(["Before", "After", "Impact"] as const).map((v) => (
                <button
                  className={view === v ? "active" : ""}
                  onClick={() => setView(v)}
                  key={v}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className={`comparison-body view-${view.toLowerCase()}`}>
            <div className="metric before">
              <small>BEFORE ACTION</small>

              <b>₹82.4L</b>

              <span>Current monthly revenue</span>
            </div>

            <div className="impact-arrow">
              <Icon name="arrow" size={27} />

              <span>+9.5%</span>
            </div>

            <div className="metric after">
              <small>AFTER ACTION</small>

              <b>{view === "Before" ? "₹82.4L" : "₹90.2L"}</b>

              <span>Projected monthly revenue</span>
            </div>
          </div>
        </section>

        <section className="impact-kpis">
          <div>
            <span className="kpi-icon">
              <Icon name="users" />
            </span>

            <small>CUSTOMERS RE-ENGAGED</small>

            <b>284</b>

            <em>High-value segment</em>
          </div>

          <div>
            <span className="kpi-icon">
              <Icon name="target" />
            </span>

            <small>EXPECTED CONVERSION</small>

            <b>18.6%</b>

            <em>+6.2% vs benchmark</em>
          </div>

          <div>
            <span className="kpi-icon">
              <Icon name="wallet" />
            </span>

            <small>RETURN ON SPEND</small>

            <b>4.8×</b>

            <em>Strong projected ROI</em>
          </div>
        </section>

        <div className="celebration-note">
          <Icon name="spark" />

          <div>
            <b>From insight to impact</b>

            <p>
              You identified a ₹4.2L risk, found its root cause, and created an
              action worth ₹7.8L—all with FlashBuzz.
            </p>
          </div>

          <Button onClick={() => go("dashboard")}>Explore more insights</Button>
        </div>
      </main>
    </div>
  );
}

// all your existing code above...

/* =========================================================
   PERSISTENT LOGIN
========================================================= */

function getStoredAuth(): boolean {
  try {
    const token =
      localStorage.getItem("flashbuzz_token") ||
      sessionStorage.getItem("flashbuzz_token");

    const user =
      localStorage.getItem("flashbuzz_user") ||
      sessionStorage.getItem("flashbuzz_user");

    if (!token || !user) {
      return false;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      return false;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const payload = JSON.parse(window.atob(padded));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("flashbuzz_token");
      localStorage.removeItem("flashbuzz_user");
      sessionStorage.removeItem("flashbuzz_token");
      sessionStorage.removeItem("flashbuzz_user");

      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth restore error:", error);

    localStorage.removeItem("flashbuzz_token");
    localStorage.removeItem("flashbuzz_user");
    sessionStorage.removeItem("flashbuzz_token");
    sessionStorage.removeItem("flashbuzz_user");

    return false;
  }
}

type StoredUser = {
  id: number;
  name: string;
  business_name: string | null;
  email: string;
};

function getStoredUser(): StoredUser | null {
  try {
    const stored =
      localStorage.getItem("flashbuzz_user") ||
      sessionStorage.getItem("flashbuzz_user");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("User restore error:", error);
    return null;
  }
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  return localStorage.getItem("flashbuzz_theme") === "dark"
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("flashbuzz_theme", theme);

  const styleId = "flashbuzz-theme-styles";

  let style = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }

  style.textContent = `
    /* =====================================================
       GLOBAL DARK MODE
    ===================================================== */

    [data-theme="dark"] {
      color-scheme: dark;
    }

    [data-theme="dark"] body {
      background: #121715 !important;
      color: #f4f6f2 !important;
    }

    /* =====================================================
       ALL MAIN PAGE BACKGROUNDS
    ===================================================== */

    [data-theme="dark"] .app-shell,
    [data-theme="dark"] .soft-bg,
    [data-theme="dark"] .auth-page,
    [data-theme="dark"] .complete-page,
    [data-theme="dark"] .processing-page,
    [data-theme="dark"] .upload-page,
    [data-theme="dark"] .dashboard-layout,
    [data-theme="dark"] .dashboard-main {
      background: #121715 !important;
      color: #f4f6f2 !important;
    }

    /* =====================================================
       HEADINGS
    ===================================================== */

    [data-theme="dark"] h1,
    [data-theme="dark"] h2,
    [data-theme="dark"] h3,
    [data-theme="dark"] h4,
    [data-theme="dark"] h5,
    [data-theme="dark"] h6 {
      color: #f4f6f2 !important;
    }

    /* =====================================================
       NORMAL TEXT
    ===================================================== */

    [data-theme="dark"] p,
    [data-theme="dark"] small,
    [data-theme="dark"] label {
      color: #aeb8b1 !important;
    }

    /* =====================================================
       HEADER
    ===================================================== */

    [data-theme="dark"] .simple-header,
    [data-theme="dark"] .dash-header,
    [data-theme="dark"] .auth-top {
      background: transparent !important;
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .dash-header h1 {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .dash-header p {
      color: #aeb8b1 !important;
    }

    /* =====================================================
       SIDEBAR
    ===================================================== */

    [data-theme="dark"] .sidebar {
      background: #171c19 !important;
      color: #f4f6f2 !important;
      border-color: #303a34 !important;
    }

    [data-theme="dark"] .sidebar nav button {
      color: #b8c0ba !important;
    }

    [data-theme="dark"] .sidebar nav button.active {
      background: #26362b !important;
      color: #ffffff !important;
    }

    [data-theme="dark"] .workspace {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #303a34 !important;
    }

    [data-theme="dark"] .workspace b,
    [data-theme="dark"] .profile b,
    [data-theme="dark"] .data-status b {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .workspace small,
    [data-theme="dark"] .profile small,
    [data-theme="dark"] .data-status small {
      color: #8f9a92 !important;
    }

    [data-theme="dark"] .profile,
    [data-theme="dark"] .data-status {
      color: #f4f6f2 !important;
    }

    /* =====================================================
       CARDS / PANELS - ALL PAGES
    ===================================================== */

    [data-theme="dark"] .panel,
    [data-theme="dark"] .auth-card,
    [data-theme="dark"] .complete-card,
    [data-theme="dark"] .preview-card,
    [data-theme="dark"] .dropzone,
    [data-theme="dark"] .file-card,
    [data-theme="dark"] .file-row,
    [data-theme="dark"] .chat-card,
    [data-theme="dark"] .action-card,
    [data-theme="dark"] .impact-card,
    [data-theme="dark"] .root-card,
    [data-theme="dark"] .insight-card,
    [data-theme="dark"] .recommendation-card {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #303a34 !important;
    }

    /* =====================================================
       KPI CARDS
    ===================================================== */

    [data-theme="dark"] .kpi-card {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #303a34 !important;
    }

    [data-theme="dark"] .kpi-card small {
      color: #aeb8b1 !important;
    }

    [data-theme="dark"] .kpi-card b {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .kpi-icon {
      background: #26362b !important;
      color: #a7c957 !important;
    }

    [data-theme="dark"] .kpi-card em {
      color: #a7c957 !important;
    }

    /* =====================================================
       DAILY AI BRIEF
    ===================================================== */

    [data-theme="dark"] .ai-brief {
      background: #386641 !important;
      color: #ffffff !important;
    }

    [data-theme="dark"] .ai-brief small {
      color: #dcebd4 !important;
    }

    [data-theme="dark"] .ai-brief b {
      color: #ffffff !important;
    }

    [data-theme="dark"] .ai-brief p {
      color: #dce8dd !important;
    }

    [data-theme="dark"] .ai-brief strong {
      color: #b7e36e !important;
    }

    /* =====================================================
       AUTH PAGES
    ===================================================== */

    [data-theme="dark"] .auth-page {
      background:
        radial-gradient(
          circle at 50% 0%,
          rgba(167, 201, 87, 0.10),
          transparent 38%
        ),
        #121715 !important;
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .auth-card {
      background: #1b211e !important;
      border-color: #303a34 !important;
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.30) !important;
    }

    [data-theme="dark"] .auth-card h1 {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .auth-subtitle,
    [data-theme="dark"] .auth-switch,
    [data-theme="dark"] .auth-trust,
    [data-theme="dark"] .remember-option,
    [data-theme="dark"] .terms-option {
      color: #aeb8b1 !important;
    }

    [data-theme="dark"] .auth-form > label,
    [data-theme="dark"] .auth-two-columns label {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .auth-form input,
    [data-theme="dark"] .google-btn {
      background: #151a17 !important;
      color: #f4f6f2 !important;
      border-color: #3a443e !important;
    }

    [data-theme="dark"] .auth-form input::placeholder {
      color: #78837b !important;
    }

    [data-theme="dark"] .google-btn {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .auth-divider {
      color: #8f9a92 !important;
    }

    [data-theme="dark"] .auth-divider::before,
    [data-theme="dark"] .auth-divider::after {
      background: #303a34 !important;
    }

    /* =====================================================
       INPUTS - ALL PAGES
    ===================================================== */

    [data-theme="dark"] input,
    [data-theme="dark"] textarea,
    [data-theme="dark"] select {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #3a443e !important;
    }

    [data-theme="dark"] input::placeholder,
    [data-theme="dark"] textarea::placeholder {
      color: #78837b !important;
    }

    [data-theme="dark"] input:disabled {
      background: #252c28 !important;
      color: #8f9a92 !important;
    }

    /* =====================================================
       BUTTONS
    ===================================================== */

    [data-theme="dark"] .btn-secondary,
    [data-theme="dark"] .google-btn,
    [data-theme="dark"] .date-button,
    [data-theme="dark"] .icon-btn {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #3a443e !important;
    }

    [data-theme="dark"] .btn-secondary:hover,
    [data-theme="dark"] .date-button:hover,
    [data-theme="dark"] .icon-btn:hover {
      background: #26362b !important;
    }

    /* =====================================================
       UPLOAD / DROPZONE
    ===================================================== */

    [data-theme="dark"] .dropzone {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #3a443e !important;
    }

    [data-theme="dark"] .dropzone.dragging {
      background: #26362b !important;
      border-color: #6a994e !important;
    }

    /* =====================================================
       PROCESSING
    ===================================================== */

    [data-theme="dark"] .process-step,
    [data-theme="dark"] .stepper {
      color: #aeb8b1 !important;
    }

    [data-theme="dark"] .process-step.current,
    [data-theme="dark"] .process-step.done {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .progress-track {
      background: #303a34 !important;
    }

    /* =====================================================
       COMPLETE / IMPACT / ROOT / ACTION
    ===================================================== */

    [data-theme="dark"] .complete-page {
      background: #121715 !important;
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .complete-card,
    [data-theme="dark"] .impact-card,
    [data-theme="dark"] .root-card,
    [data-theme="dark"] .action-card,
    [data-theme="dark"] .insight-card,
    [data-theme="dark"] .recommendation-card {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #303a34 !important;
    }

    /* =====================================================
       CHAT
    ===================================================== */

    [data-theme="dark"] .chat-card,
    [data-theme="dark"] .chat-message,
    [data-theme="dark"] .chat-input {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #303a34 !important;
    }

    [data-theme="dark"] .chat-message p,
    [data-theme="dark"] .chat-card p {
      color: #aeb8b1 !important;
    }

    /* =====================================================
       PROFILE / SETTINGS
    ===================================================== */

    [data-theme="dark"] .simple-header {
      color: #f4f6f2 !important;
    }

    [data-theme="dark"] .simple-header button {
      color: #b8c0ba !important;
    }

    [data-theme="dark"] .page-kicker {
      color: #a7c957 !important;
    }

    /* =====================================================
       TOASTS / ALERTS
    ===================================================== */

    [data-theme="dark"] .toast,
    [data-theme="dark"] .alert-card {
      background: #1b211e !important;
      color: #f4f6f2 !important;
      border-color: #3a443e !important;
    }

    /* =====================================================
       LINKS
    ===================================================== */

    [data-theme="dark"] a,
    [data-theme="dark"] .text-link,
    [data-theme="dark"] .forgot-btn {
      color: #a7c957 !important;
    }

    /* =====================================================
       ICONS
    ===================================================== */

    [data-theme="dark"] svg {
      color: inherit;
    }

    /* =====================================================
       DO NOT FORCE ALL SPANS TO ONE COLOR
       This prevents the visibility problem you had.
    ===================================================== */
  `;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    getStoredAuth() ? "dashboard" : "landing",
  );

const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

useEffect(() => {
  applyTheme(theme);
}, [theme]);

  const go = (next: Screen) => {
    setScreen(next);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (screen === "landing") return <Landing go={go} />;

  if (screen === "login") return <Login go={go} />;

  if (screen === "register") return <Register go={go} />;

  if (screen === "upload") return <Upload go={go} />;

   if (screen === "prepare") return <PrepareData go={go} />;

  if (screen === "processing") return <Processing go={go} />;

  if (screen === "complete") return <Complete go={go} />;

  if (screen === "dashboard") return <Dashboard go={go} />;

  if (screen === "root") return <RootCause go={go} />;

  if (screen === "chat") return <Chat go={go} />;

  if (screen === "action") return <ActionPlan go={go} />;

  if (screen === "profile") {
  return (
    <Profile
      go={go}
      theme={theme}
      setTheme={setTheme}
    />
  );
}


  return <Impact go={go} />;
}

