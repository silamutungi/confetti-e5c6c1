import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="px-4 py-20 md:py-32 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-800 leading-tight mb-6">
          Throw parties,<br />not spreadsheets.
        </h1>
        <p className="text-lg md:text-xl text-ink/60 mb-10 max-w-xl mx-auto">
          Beautiful event invitations your guests actually want to open. Share a link, collect RSVPs, and manage your guest list — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-primary text-white font-mono font-medium min-h-[44px] px-8 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary text-center"
          >
            Create your first event
          </Link>
          <Link
            to="/login"
            className="border-2 border-primary-dark text-primary-dark font-mono font-medium min-h-[44px] px-8 py-3 rounded-lg hover:bg-primary-dark/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-center"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24 bg-ink text-paper">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-600 text-center mb-16">
            Everything you need to host
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-serif text-xl font-600 mb-2">One-click invites</h3>
              <p className="text-[#c8c4bc] text-sm">
                Create an event page in seconds. Share a single link — no app downloads, no account required for guests.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-serif text-xl font-600 mb-2">Live guest list</h3>
              <p className="text-[#c8c4bc] text-sm">
                See who's going, who's maybe, and who can't make it — updated in real time as guests respond.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-serif text-xl font-600 mb-2">Beautiful by default</h3>
              <p className="text-[#c8c4bc] text-sm">
                Every event page looks stunning. Pick an emoji, add your details, and you're live. No design skills needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24 text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-600 mb-6">
          Your next event starts here
        </h2>
        <p className="text-ink/60 mb-8">
          Free to use. No credit card required. Create your first event in under a minute.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-primary text-white font-mono font-medium min-h-[44px] px-8 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Get started free
        </Link>
      </section>
    </div>
  );
}