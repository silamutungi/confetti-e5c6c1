import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/60 py-10">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-mono">&copy; {new Date().getFullYear()} Confetti. All rights reserved.</p>
        <div className="flex gap-6 text-sm font-mono">
          <Link to="/privacy" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Terms of Service</Link>
          <a href="mailto:hello@confetti.events" className="hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Contact</a>
        </div>
      </div>
    </footer>
  );
}