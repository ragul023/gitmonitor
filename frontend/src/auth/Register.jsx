import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  GitBranch,
  Activity,
  Sparkles,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register } from "../api/auth.api";

function Register() {
const navigate = useNavigate();
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Initial states
    gsap.set(".auth-brand", {
      opacity: 0,
      y: -20,
    });

    gsap.set(cardRef.current, {
      opacity: 0,
      y: 35,
      scale: 0.97,
    });

    gsap.set(".auth-header", {
      opacity: 0,
      y: 15,
    });

    gsap.set(".github-btn", {
      opacity: 0,
      y: 15,
    });

    gsap.set(".auth-divider", {
      opacity: 0,
    });

    gsap.set(".form-group", {
      opacity: 0,
      y: 10,
    });

    gsap.set(".auth-submit", {
      opacity: 0,
      y: 10,
    });

    gsap.set(".auth-switch", {
      opacity: 0,
    });

    // Animation
    tl.to(".auth-brand", {
      opacity: 1,
      y: 0,
      duration: 0.6,
    })
      .to(
        cardRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
        },
        "-=0.3"
      )
      .to(
        ".auth-header",
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.25"
      )
      .to(
        ".github-btn",
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.15"
      )
      .to(
        ".auth-divider",
        {
          opacity: 1,
          duration: 0.3,
        },
        "-=0.15"
      )
      .to(
        ".form-group",
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.35,
        },
        "-=0.1"
      )
      .to(
        ".auth-submit",
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.1"
      )
      .to(
        ".auth-switch",
        {
          opacity: 1,
          duration: 0.3,
        },
        "-=0.1"
      );

    // Floating dots
    gsap.to(".floating-dot", {
      y: -12,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.4,
    });
  }, pageRef);

  return () => ctx.revert();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleRegister = async (e) => {
  e.preventDefault();

  setError("");

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const response = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    localStorage.setItem("token", response.token);

    toast.success("Account created successfully");

    navigate("/connect-github");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};
  const handleGithubRegister = () => {
    console.log("GitHub OAuth");
  };

  return (
    <div ref={pageRef} className="auth-page grid-bg">
      <div className="auth-glow" />

      <div className="floating-dot dot-1" />
      <div className="floating-dot dot-2" />
      <div className="floating-dot dot-3" />

      <div className="auth-wrapper register-wrapper">

        {/* Top */}
        <div className="auth-top auth-brand">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">
              <GitBranch size={17} />
            </span>

            <span>GitHub Monitor</span>
          </Link>

          <div className="secure-badge">
            <span className="pulse-dot" />
            Secure connection
          </div>
        </div>

        {/* Register Layout */}
        <div className="register-layout">

          {/* Register Card */}
          <div ref={cardRef} className="auth-card register-card">

            {/* Header */}
            <div className="auth-header auth-form-element">
              <div className="auth-icon">
                <Sparkles size={22} />
              </div>

              <h1>Create your account</h1>

              <p>
                Start monitoring your GitHub repositories in real time.
              </p>
            </div>

            {/* GitHub */}
            <button
              type="button"
              className="github-btn"
              onClick={handleGithubRegister}
            >
              <FaGithub size={19} />

              <span>Continue with GitHub</span>
            </button>

            {/* Divider */}
            <div className="auth-divider auth-form-element">
              <span>or register with email</span>
            </div>

            {/* Error */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister}>

              {/* Username */}
              <div className="form-group auth-form-element">
                <label htmlFor="username">
                  <User size={14} />
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group auth-form-element">
                <label htmlFor="email">
                  <Mail size={14} />
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group auth-form-element">
                <label htmlFor="password">
                  <Lock size={14} />
                  Password
                </label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group auth-form-element">
                <label htmlFor="confirm-password">
                  <Lock size={14} />
                  Confirm password
                </label>

                <div className="password-wrapper">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                  >
                    {showConfirm ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit auth-form-element"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </span>

                {!loading && <ArrowRight size={18} />}
              </button>

            </form>

            {/* Login Link */}
            <p className="auth-switch auth-form-element">
              Already have an account?

              <Link to="/login">
                Sign in
              </Link>
            </p>

          </div>

          {/* Right Side */}
          <div className="register-side">

            <div className="side-line" />

            <div className="side-item">
              <div className="side-icon">
                <Activity size={17} />
              </div>

              <div>
                <strong>Real-time events</strong>

                <p>
                  See repository activity as it happens.
                </p>
              </div>
            </div>

            <div className="side-item">
              <div className="side-icon">
                <GitBranch size={17} />
              </div>

              <div>
                <strong>All your repositories</strong>

                <p>
                  Keep everything organized in one dashboard.
                </p>
              </div>
            </div>

            <div className="side-item">
              <div className="side-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>Secure authentication</strong>

                <p>
                  Your account stays protected.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="auth-footer">
          By creating an account, you agree to our Terms and Privacy Policy.
        </p>

      </div>
    </div>
  );
}

export default Register;