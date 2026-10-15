import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useTheme } from "../hooks/useTheme";
import { problems } from "../data/problems";
import "../App.css";
import "./Landing.css";

const features = [
  {
    title: "20 curated problems",
    description:
      "Practice arrays, strings, math, stacks, and more with clear examples and hidden test cases.",
  },
  {
    title: "Python in-browser + server languages",
    description:
      "Python runs locally in your browser. Java, C, C++, and JavaScript run through a secured server API when Judge0 is configured.",
  },
  {
    title: "Track your progress",
    description:
      "Bookmarks, solved status, and drafts are saved locally so you can pick up where you left off.",
  },
];

export default function LandingPage() {
  const { darkMode } = useTheme();
  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;

  return (
    <div className={`app landing ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="app-container">
        <SiteHeader variant="landing" />

        <main className="landing-main">
          <section className="hero">
            <div className="hero-copy">
              <p className="hero-eyebrow">Coding practice platform</p>
              <h1 className="hero-title">
                Level up your skills with <span>CodeSpace</span>
              </h1>
              <p className="hero-description">
                A focused workspace for beginners and interview prep — search
                problems, code in Monaco, run Python locally in your browser, and
                see results in seconds.
              </p>
              <div className="hero-actions">
                <Link to="/practice" className="cta-button primary">
                  Open practice workspace
                </Link>
                <Link to="/practice?problem=1" className="cta-button secondary">
                  Try Two Sum
                </Link>
              </div>
              <ul className="hero-stats">
                <li>
                  <strong>{problems.length}</strong>
                  <span>problems</span>
                </li>
                <li>
                  <strong>{easyCount}</strong>
                  <span>easy</span>
                </li>
                <li>
                  <strong>{mediumCount}</strong>
                  <span>medium</span>
                </li>
              </ul>
            </div>
            <div className="hero-visual">
              <img
                src={heroImage}
                alt="Developer working on coding challenges"
                width={560}
                height={420}
                loading="eager"
              />
            </div>
          </section>

          <section className="features-section" aria-labelledby="features-heading">
            <h2 id="features-heading">Built for focused practice</h2>
            <div className="features-grid">
              {features.map((feature) => (
                <article key={feature.title} className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-card">
              <h2>Ready to write your first solution?</h2>
              <p>
                Dark mode, filters, bookmarks, and autosaved drafts are already
                wired up in the practice workspace.
              </p>
              <Link to="/practice" className="cta-button primary">
                Start practicing
              </Link>
            </div>
          </section>

          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
