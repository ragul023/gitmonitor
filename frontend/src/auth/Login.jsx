import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import {
  GitBranch,
  GitPullRequest,
  CircleDot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
  Zap,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

import "./Auth.css";

import { login } from "../api/auth.api";

function Login() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const visualRef = useRef(null);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Set initial states explicitly
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

      gsap.set(".remember", {
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

      // Main entrance animation
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
          ".remember",
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
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

      // Orbit animation
      gsap.to(".ring-1", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".ring-2", {
        rotation: -360,
        duration: 35,
        repeat: -1,
        ease: "none",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login({
        email: e.target.email.value,
        password: e.target.password.value,
      });

      localStorage.setItem("token", response.token);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    console.log("GitHub OAuth");
  };

  return (
    <div ref={pageRef} className="auth-page grid-bg">

      <div className="auth-glow" />

      <div className="floating-dot dot-1" />
      <div className="floating-dot dot-2" />
      <div className="floating-dot dot-3" />

      <div className="auth-wrapper">

        {/* TOP */}
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

        {/* MAIN */}
        <div className="auth-layout">

          {/* LOGIN CARD */}
          <div ref={cardRef} className="auth-card">

            {/* HEADER */}
            <div className="auth-header">

              <div className="auth-icon">
                <Activity size={22} />
              </div>

              <h1>Welcome back</h1>

              <p>
                Sign in to keep an eye on everything
                happening in your repositories.
              </p>

            </div>

            {/* GITHUB */}
            <button
              type="button"
              className="github-btn"
              onClick={handleGithubLogin}
            >
              <FaGithub size={19} />

              <span>
                Continue with GitHub
              </span>

            </button>

            {/* DIVIDER */}
            <div className="auth-divider">

              <span>
                or continue with email
              </span>

            </div>

            {/* FORM */}
            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="form-group">

                <label htmlFor="email">

                  <Mail size={14} />

                  Email address

                </label>

                <div className="input-wrapper">

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="form-group">

                <div className="label-row">

                  <label htmlFor="password">

                    <Lock size={14} />

                    Password

                  </label>

                  <a href="#forgot">
                    Forgot password?
                  </a>

                </div>

                <div className="password-wrapper">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
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

              {/* REMEMBER */}
              <label className="remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </span>

                {!loading && (
                  <ArrowRight size={18} />
                )}

              </button>

            </form>

            {/* REGISTER */}
            <p className="auth-switch">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create an account
              </Link>

            </p>

          </div>

          {/* RIGHT VISUAL */}
          <div
            ref={visualRef}
            className="auth-visual"
          >

            <div className="visual-glow" />

            <div className="orbit-ring ring-1" />

            <div className="orbit-ring ring-2" />

            <div className="visual-content">

              <div className="visual-icon">
                <Zap size={25} />
              </div>

              <span className="visual-label">
                REAL-TIME MONITORING
              </span>

              <h2>
                Your repositories.
                <br />
                <span>
                  Always in sight.
                </span>
              </h2>

              <p>
                Track pushes, pull requests, issues and
                repository activity from one place.
              </p>

              {/* ACTIVITY CARD */}
              <div className="activity-card">

                <div className="activity-top">

                  <div>

                    <span className="mini-status" />

                    Live activity

                  </div>

                  <span className="activity-time">
                    now
                  </span>

                </div>

                {/* PUSH */}
                <div className="activity-row">

                  <div className="activity-event push">

                    <GitBranch size={15} />

                  </div>

                  <div>

                    <strong>
                      Push event
                    </strong>

                    <span>
                      main branch updated
                    </span>

                  </div>

                  <span className="event-dot" />

                </div>

                {/* PR */}
                <div className="activity-row">

                  <div className="activity-event pr">

                    <GitPullRequest size={15} />

                  </div>

                  <div>

                    <strong>
                      Pull request
                    </strong>

                    <span>
                      New PR opened
                    </span>

                  </div>

                  <span className="event-dot" />

                </div>

                {/* ISSUE */}
                <div className="activity-row">

                  <div className="activity-event issue">

                    <CircleDot size={15} />

                  </div>

                  <div>

                    <strong>
                      Issue
                    </strong>

                    <span>
                      Issue activity detected
                    </span>

                  </div>

                  <span className="event-dot" />

                </div>

              </div>

              {/* FOOTER */}
              <div className="visual-footer">

                <ShieldCheck size={16} />

                Your GitHub activity, organized.

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <p className="auth-footer">

          By continuing, you agree to our
          Terms and Privacy Policy.

        </p>

      </div>

    </div>
  );
}

export default Login;