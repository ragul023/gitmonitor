import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  GitBranch,
//   Github,
  ShieldCheck,
  ArrowRight,
  Activity,
  CheckCircle2,
} from "lucide-react";

import "./Auth.css";
import { FaGithub } from "react-icons/fa";

function ConnectGithub() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      gsap.set(".auth-brand", {
        opacity: 0,
        y: -20,
      });

      gsap.set(cardRef.current, {
        opacity: 0,
        y: 35,
        scale: 0.97,
      });

      gsap.set(".connect-content", {
        opacity: 0,
        y: 15,
      });

      gsap.set(".connect-item", {
        opacity: 0,
        y: 10,
      });

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
          ".connect-content",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.25"
        )
        .to(
          ".connect-item",
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.35,
          },
          "-=0.15"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

const handleConnectGithub = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/auth/github/start",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to connect GitHub"
      );
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("GitHub OAuth Error:", error);

    toast.error(
      error.message || "GitHub connection failed"
    );
  }
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

          {/* CONNECT CARD */}

          <div
            ref={cardRef}
            className="auth-card connect-card"
          >

            <div className="connect-content">

              {/* ICON */}

              <div className="auth-icon github-connect-icon">
                <FaGithub size={15}/>
              </div>

              <h1>Connect your GitHub</h1>

              <p>
                Connect your GitHub account to start
                monitoring your repositories and activity.
              </p>

              {/* CONNECT BUTTON */}

              <button
                type="button"
                className="github-btn connect-github-btn"
                onClick={handleConnectGithub}
              >

                 <FaGithub size={19}/>

                <span>
                  Connect with GitHub
                </span>

                <ArrowRight size={17} />

              </button>

              {/* INFORMATION */}

              <div className="connect-info">

                <div className="connect-item">

                  <div className="connect-item-icon">
                    <CheckCircle2 size={16} />
                  </div>

                  <div>
                    <strong>
                      Access your repositories
                    </strong>

                    <span>
                      View repositories connected to your GitHub account.
                    </span>
                  </div>

                </div>

                <div className="connect-item">

                  <div className="connect-item-icon">
                    <Activity size={16} />
                  </div>

                  <div>
                    <strong>
                      Monitor activity
                    </strong>

                    <span>
                      Track pushes, pull requests and issues.
                    </span>
                  </div>

                </div>

                <div className="connect-item">

                  <div className="connect-item-icon">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <strong>
                      Secure connection
                    </strong>

                    <span>
                      GitHub authentication is handled securely through OAuth.
                    </span>
                  </div>

                </div>

              </div>

              {/* SKIP */}

              {/* <button
                type="button"
                className="connect-skip"
                onClick={() => navigate("/dashboard")}
              >
                Skip for now
              </button> */}

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <p className="auth-footer">

          You can manage your GitHub connection from your account settings.

        </p>

      </div>

    </div>
  );
}

export default ConnectGithub;