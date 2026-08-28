import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  GitFork as Github,
  Activity,
  GitPullRequest,
  CircleDot,
  Zap,
  Bot,
  ArrowRight,
  Bell,
  Shield,
  Code2,
  Webhook,
  GitCommit,
  TrendingUp,
} from "lucide-react";

import "./LandingPage.css";

gsap.registerPlugin(ScrollTrigger);

const featItems = [
  [
    Webhook,
    "Real-time Webhooks",
    "Connect your repositories via GitHub webhooks and receive events instantly as they happen.",
    "feature-card-icon--blue",
  ],
  [
    Activity,
    "Event Timeline",
    "Track every push, pull request, and issue with a detailed, filterable activity timeline.",
    "feature-card-icon--purple",
  ],
  [
    Bell,
    "Smart Notifications",
    "Get notified about important events across all your monitored repositories in one place.",
    "feature-card-icon--warning",
  ],
  [
    Shield,
    "Secure & Reliable",
    "Webhook signature verification ensures every event is authenticated and trustworthy.",
    "feature-card-icon--green",
  ],
  [
    Code2,
    "Code-level Detail",
    "Drill into commits, changed files, and diffs to understand exactly what changed and why.",
    "feature-card-icon--blue",
  ],
  [
    Zap,
    "Lightning Fast",
    "Built for speed with WebSocket-powered real-time updates and a responsive, modern interface.",
    "feature-card-icon--purple",
  ],
];

const stats = [
  [Activity, "794", "Total Events"],
  [GitCommit, "412", "Pushes"],
  [GitPullRequest, "198", "Pull Requests"],
  [CircleDot, "184", "Issues"],
];

const activities = [
  [GitCommit, "blue", "Elon Musk pushed 3 commits to main", "green"],
  [GitPullRequest, "purple", "New pull request opened: OAuth2 flow", "warning"],
  [CircleDot, "warning", "Issue #23 opened: Rate limiting bug", "red"],
  [GitPullRequest, "purple", "Pull request #45 merged into main", "green"],
];

const chart = [40, 65, 30, 90, 72, 25, 18];

const steps = [
  [
    Webhook,
    "01",
    "Connect a Webhook",
    "Add a GitHub webhook URL to your repository. GitHub Monitor listens for events automatically.",
  ],
  [
    Activity,
    "02",
    "Events Flow In",
    "Pushes, pull requests, and issues arrive in real-time. Everything is stored and organized.",
  ],
  [
    Bot,
    "03",
    "Monitor & Analyze",
    "View activity on your dashboard, filter events, and ask the AI assistant about changes.",
  ],
];

const animateOnScroll = (
  selector,
  duration = 0.7,
  delay = 0.1,
  direction = "y",
) => {
  gsap.utils.toArray(selector).forEach((el, i) => {
    gsap.fromTo(
      el,
      {
        autoAlpha: 0,
        [direction]: direction === "x" ? -30 : 40,
      },
      {
        autoAlpha: 1,
        [direction]: 0,
        duration,
        delay: i * delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });
};

function LandingPage() {
  const navigate = useNavigate();
  const landingRef = useRef(null);
  const aiSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".hero-badge", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
          },
          "-=0.4",
        )
        .from(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          ".hero-buttons",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".hero-preview",
          {
            opacity: 0,
            scale: 0.95,
            y: 40,
            duration: 1,
          },
          "-=0.5",
        );

      gsap.from(".preview-card", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.12,
        delay: 0.8,
        ease: "power2.out",
      });

      gsap.from(".preview-activity", {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.1,
        delay: 1.2,
        ease: "power2.out",
      });

      gsap.from(".preview-glow-dot", {
        scale: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 1,
        ease: "back.out(2)",
      });

      animateOnScroll(".feature-card");
      animateOnScroll(".step-item", 0.6, 0.12, "x");
      animateOnScroll(".step-connector", 0.5, 0.15);

      if (aiSectionRef.current) {
        gsap.fromTo(
          ".ai-section-content",
          {
            autoAlpha: 0,
            y: 40,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aiSectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, landingRef);

    return () => ctx.revert();
  }, []);

  const go = (path) => navigate(path);

  return (
    <div ref={landingRef} className="landing">
      {/* NAVBAR */}

      <nav className="landing-nav glass-strong">
        <div className="landing-nav-brand">
          <Github size={22} />
          <span>GitHub Monitor</span>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#ai">AI Assistant</a>
        </div>

        <button className="landing-nav-cta" onClick={() => go("/dashboard")}>
          View Dashboard
          <ArrowRight size={16} />
        </button>
      </nav>

      {/* HERO */}

      <section className="landing-hero grid-bg">
        <div className="landing-hero-glow" />

        <div className="landing-hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Real-time GitHub Webhook Monitoring
          </div>

          <h1 className="hero-title">
            Know what is happening in your repositories.
          </h1>

          <p className="hero-subtitle">
            GitHub Monitor turns repository activity into a clear, real-time
            view of everything happening across your GitHub repositories.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => go("/dashboard")}>
              Get Started
              <ArrowRight size={18} />
            </button>

            <button className="btn-secondary" onClick={() => go("/dashboard")}>
              View Dashboard
            </button>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}

        <div className="hero-preview">
          <div className="preview-window glass-strong">
            <div className="preview-window-header">
              <div className="preview-window-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-window-title">
                <Github size={14} />
                github-monitor / main
              </div>

              <div className="preview-window-live">
                <span className="preview-glow-dot" />
                Live
              </div>
            </div>

            <div className="preview-window-body">
              {/* STATS */}

              <div className="preview-stats">
                {stats.map(([Icon, value, label]) => (
                  <div className="preview-card" key={label}>
                    <Icon size={16} />

                    <div>
                      <span className="preview-card-value">{value}</span>

                      <span className="preview-card-label">{label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIVITY */}

              <div className="preview-activity-section">
                <div className="preview-activity-header">
                  <span>Recent Activity</span>
                  <TrendingUp size={14} />
                </div>

                <div className="preview-activity-list">
                  {activities.map(([Icon, iconClass, text, dotClass]) => (
                    <div className="preview-activity" key={text}>
                      <div
                        className={`preview-activity-icon preview-activity-icon--${iconClass}`}
                      >
                        <Icon size={12} />
                      </div>

                      <span>{text}</span>

                      <span
                        className={`preview-glow-dot preview-glow-dot--${dotClass}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CHART */}

              <div className="preview-chart">
                {chart.map((height, i) => (
                  <div
                    className="preview-chart-bar"
                    style={{ height: `${height}%` }}
                    key={i}
                  >
                    <span>{"MTWTFSS"[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="preview-glow" />
        </div>
      </section>

      {/* FEATURES */}

      <section id="features" className="landing-features">
        <div className="landing-section-header">
          <h2>Everything you need to monitor your repositories</h2>

          <p>
            Powerful features that give you complete visibility into your GitHub
            activity.
          </p>
        </div>

        <div className="features-grid">
          {featItems.map(([Icon, title, description, iconClass]) => (
            <div className="feature-card" key={title}>
              <div className={`feature-card-icon ${iconClass}`}>
                <Icon size={22} />
              </div>

              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section id="how-it-works" className="landing-how grid-bg">
        <div className="landing-section-header">
          <h2>How it works</h2>

          <p>
            Three simple steps to get full visibility into your repositories.
          </p>
        </div>

        <div className="steps-container">
          {steps.map(([Icon, number, title, description], i) => (
            <React.Fragment key={number}>
              <div className="step-item">
                <div className="step-number">{number}</div>

                <div className="step-icon">
                  <Icon size={22} />
                </div>

                <h3>{title}</h3>

                <p>{description}</p>
              </div>

              {i < steps.length - 1 && <div className="step-connector" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* AI SECTION */}

      <section ref={aiSectionRef} id="ai" className="landing-ai">
        <div className="ai-section-content">
          <div className="ai-section-left">
            <div className="ai-section-badge">
              <Bot size={16} />
              AI-Powered
            </div>

            <h2>Ask your repository anything</h2>

            <p>
              The built-in AI assistant understands your repository activity.
              Ask about recent changes, contributor activity, or get a summary
              of what happened this week — all in natural language.
            </p>

            <button className="btn-primary" onClick={() => go("/ai")}>
              Try AI Assistant
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="ai-section-right">
            <div className="ai-chat-preview glass-strong">
              <div className="ai-chat-message ai-chat-message--user">
                What happened today?
              </div>

              <div className="ai-chat-message ai-chat-message--ai">
                <Bot size={16} />

                <span>
                  3 push events, 2 pull requests opened, and 1 new issue. Most
                  active in github-monitor.
                </span>
              </div>

              <div className="ai-chat-message ai-chat-message--user">
                Who contributed recently?
              </div>

              <div className="ai-chat-message ai-chat-message--ai">
                <Bot size={16} />

                <span>
                  ragul023, sarah-dev, mike-codes, and alex-build contributed
                  across 4 repositories.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <Github size={20} />
            <span>GitHub Monitor</span>
          </div>

          <p className="landing-footer-tagline">
            Real-time repository activity monitoring for developers.
          </p>

          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#ai">AI Assistant</a>

            <button onClick={() => go("/dashboard")}>Dashboard</button>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>Built for developers. Mock data MVP.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
