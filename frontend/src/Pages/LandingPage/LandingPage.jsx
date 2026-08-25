import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GitFork as Github,
  Activity,
  GitBranch,
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
} from 'lucide-react';
import './LandingPage.css';

function LandingPage({ onNavigate }) {
  const heroRef = useRef(null);
  const previewRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aiSectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
      gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.1, ease: 'power2.out' });
      gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.7, delay: 0.3, ease: 'power2.out' });
      gsap.from('.hero-buttons', { opacity: 0, y: 20, duration: 0.6, delay: 0.5, ease: 'power2.out' });
      gsap.from('.hero-preview', { opacity: 0, scale: 0.95, y: 40, duration: 1, delay: 0.4, ease: 'power2.out' });

      gsap.from('.preview-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.12,
        delay: 0.8,
        ease: 'power2.out',
      });

      gsap.from('.preview-activity', {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power2.out',
      });

      gsap.from('.preview-glow-dot', {
        scale: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 1,
        ease: 'back.out(2)',
      });

      gsap.from('.feature-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('.step-item', {
        opacity: 0,
        x: -30,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 75%',
        },
      });

      gsap.from('.ai-section-content', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: aiSectionRef.current,
          start: 'top 75%',
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="landing">
      {/* Navbar */}
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
        <button className="landing-nav-cta" onClick={() => onNavigate('dashboard')}>
          View Dashboard
          <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero */}
      <section className="landing-hero grid-bg">
        <div className="landing-hero-glow" />
        <div className="landing-hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Real-time GitHub Webhook Monitoring
          </div>
          <h1 className="hero-title">Know what is happening in your repositories.</h1>
          <p className="hero-subtitle">
            GitHub Monitor turns repository activity into a clear, real-time view of everything happening across your GitHub repositories.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
              Get Started
              <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('dashboard')}>
              View Dashboard
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div ref={previewRef} className="hero-preview">
          <div className="preview-window glass-strong">
            <div className="preview-window-header">
              <div className="preview-window-dots">
                <span /><span /><span />
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
              <div className="preview-stats">
                <div className="preview-card">
                  <Activity size={16} />
                  <div>
                    <span className="preview-card-value">794</span>
                    <span className="preview-card-label">Total Events</span>
                  </div>
                </div>
                <div className="preview-card">
                  <GitCommit size={16} />
                  <div>
                    <span className="preview-card-value">412</span>
                    <span className="preview-card-label">Pushes</span>
                  </div>
                </div>
                <div className="preview-card">
                  <GitPullRequest size={16} />
                  <div>
                    <span className="preview-card-value">198</span>
                    <span className="preview-card-label">Pull Requests</span>
                  </div>
                </div>
                <div className="preview-card">
                  <CircleDot size={16} />
                  <div>
                    <span className="preview-card-value">184</span>
                    <span className="preview-card-label">Issues</span>
                  </div>
                </div>
              </div>

              <div className="preview-activity-section">
                <div className="preview-activity-header">
                  <span>Recent Activity</span>
                  <TrendingUp size={14} />
                </div>
                <div className="preview-activity-list">
                  <div className="preview-activity">
                    <div className="preview-activity-icon preview-activity-icon--blue"><GitCommit size={12} /></div>
                    <span>ragul023 pushed 3 commits to main</span>
                    <span className="preview-glow-dot preview-glow-dot--green" />
                  </div>
                  <div className="preview-activity">
                    <div className="preview-activity-icon preview-activity-icon--purple"><GitPullRequest size={12} /></div>
                    <span>New pull request opened: OAuth2 flow</span>
                    <span className="preview-glow-dot preview-glow-dot--warning" />
                  </div>
                  <div className="preview-activity">
                    <div className="preview-activity-icon preview-activity-icon--warning"><CircleDot size={12} /></div>
                    <span>Issue #23 opened: Rate limiting bug</span>
                    <span className="preview-glow-dot preview-glow-dot--red" />
                  </div>
                  <div className="preview-activity">
                    <div className="preview-activity-icon preview-activity-icon--purple"><GitPullRequest size={12} /></div>
                    <span>Pull request #45 merged into main</span>
                    <span className="preview-glow-dot preview-glow-dot--green" />
                  </div>
                </div>
              </div>

              <div className="preview-chart">
                <div className="preview-chart-bar" style={{ height: '40%' }}><span>M</span></div>
                <div className="preview-chart-bar" style={{ height: '65%' }}><span>T</span></div>
                <div className="preview-chart-bar" style={{ height: '30%' }}><span>W</span></div>
                <div className="preview-chart-bar" style={{ height: '90%' }}><span>T</span></div>
                <div className="preview-chart-bar" style={{ height: '72%' }}><span>F</span></div>
                <div className="preview-chart-bar" style={{ height: '25%' }}><span>S</span></div>
                <div className="preview-chart-bar" style={{ height: '18%' }}><span>S</span></div>
              </div>
            </div>
          </div>
          <div className="preview-glow" />
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" className="landing-features">
        <div className="landing-section-header">
          <h2>Everything you need to monitor your repositories</h2>
          <p>Powerful features that give you complete visibility into your GitHub activity.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-icon feature-card-icon--blue"><Webhook size={22} /></div>
            <h3>Real-time Webhooks</h3>
            <p>Connect your repositories via GitHub webhooks and receive events instantly as they happen.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon feature-card-icon--purple"><Activity size={22} /></div>
            <h3>Event Timeline</h3>
            <p>Track every push, pull request, and issue with a detailed, filterable activity timeline.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon feature-card-icon--warning"><Bell size={22} /></div>
            <h3>Smart Notifications</h3>
            <p>Get notified about important events across all your monitored repositories in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon feature-card-icon--green"><Shield size={22} /></div>
            <h3>Secure & Reliable</h3>
            <p>Webhook signature verification ensures every event is authenticated and trustworthy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon feature-card-icon--blue"><Code2 size={22} /></div>
            <h3>Code-level Detail</h3>
            <p>Drill into commits, changed files, and diffs to understand exactly what changed and why.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon feature-card-icon--purple"><Zap size={22} /></div>
            <h3>Lightning Fast</h3>
            <p>Built for speed with WebSocket-powered real-time updates and a responsive, modern interface.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={howItWorksRef} id="how-it-works" className="landing-how grid-bg">
        <div className="landing-section-header">
          <h2>How it works</h2>
          <p>Three simple steps to get full visibility into your repositories.</p>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">01</div>
            <div className="step-icon"><Webhook size={22} /></div>
            <h3>Connect a Webhook</h3>
            <p>Add a GitHub webhook URL to your repository. GitHub Monitor listens for events automatically.</p>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-number">02</div>
            <div className="step-icon"><Activity size={22} /></div>
            <h3>Events Flow In</h3>
            <p>Pushes, pull requests, and issues arrive in real-time. Everything is stored and organized.</p>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-number">03</div>
            <div className="step-icon"><Bot size={22} /></div>
            <h3>Monitor & Analyze</h3>
            <p>View activity on your dashboard, filter events, and ask the AI assistant about changes.</p>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section ref={aiSectionRef} id="ai" className="landing-ai">
        <div className="ai-section-content">
          <div className="ai-section-left">
            <div className="ai-section-badge">
              <Bot size={16} />
              AI-Powered
            </div>
            <h2>Ask your repository anything</h2>
            <p>
              The built-in AI assistant understands your repository activity. Ask about recent changes,
              contributor activity, or get a summary of what happened this week — all in natural language.
            </p>
            <button className="btn-primary" onClick={() => onNavigate('ai')}>
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
                <span>3 push events, 2 pull requests opened, and 1 new issue. Most active in github-monitor.</span>
              </div>
              <div className="ai-chat-message ai-chat-message--user">
                Who contributed recently?
              </div>
              <div className="ai-chat-message ai-chat-message--ai">
                <Bot size={16} />
                <span>ragul023, sarah-dev, mike-codes, and alex-build contributed across 4 repositories.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <Github size={20} />
            <span>GitHub Monitor</span>
          </div>
          <p className="landing-footer-tagline">Real-time repository activity monitoring for developers.</p>
          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#ai">AI Assistant</a>
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
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
