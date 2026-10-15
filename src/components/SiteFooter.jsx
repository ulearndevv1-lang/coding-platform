import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>CodeSpace — Keep learning, keep coding.</p>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/practice">Practice</Link>
      </div>
    </footer>
  );
}
