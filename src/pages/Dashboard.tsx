import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Event, Rsvp } from '../types';

const EMOJI_OPTIONS = ['🎉', '🎂', '🍕', '🎸', '🏖️', '🎄', '💍', '🏠', '🎮', '🍷'];

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [coverEmoji, setCoverEmoji] = useState('🎉');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error: fetchErr } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('event_date', { ascending: true });
    setLoading(false);
    if (fetchErr) { setError('Could not load events.'); return; }
    setEvents(data || []);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const fetchRsvps = async (eventId: string) => {
    setRsvpLoading(true);
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
    setRsvps(data || []);
    setRsvpLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !eventDate) { setFormError('Title and date are required.'); return; }
    if (title.length > 200) { setFormError('Title is too long.'); return; }
    setFormLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setFormError('Not authenticated.'); setFormLoading(false); return; }
    const slug = crypto.randomUUID().slice(0, 8);
    const { error: insertErr } = await supabase.from('events').insert({
      user_id: session.user.id,
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 1000),
      location: location.trim().slice(0, 300),
      event_date: eventDate,
      event_time: eventTime || '19:00',
      cover_emoji: coverEmoji,
      share_slug: slug
    });
    setFormLoading(false);
    if (insertErr) { setFormError('Could not create event.'); return; }
    setTitle(''); setDescription(''); setLocation(''); setEventDate(''); setEventTime(''); setCoverEmoji('🎉');
    setShowForm(false);
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    await supabase.from('events').update({ deleted_at: new Date().toISOString() }).eq('id', eventId);
    if (selectedEvent?.id === eventId) { setSelectedEvent(null); setRsvps([]); }
    fetchEvents();
  };

  const statusBadge = (status: string) => {
    if (status === 'going') return 'bg-green-100 text-green-800';
    if (status === 'maybe') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const statusLabel = (status: string) => {
    if (status === 'going') return 'Going';
    if (status === 'maybe') return 'Maybe';
    return "Can't go";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status">
          <span className="sr-only">Loading events</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 border border-red-300 bg-red-50 px-4 py-3 rounded-lg" role="alert">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Your events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white font-mono font-medium min-h-[44px] px-5 py-2 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {showForm ? 'Cancel' : '+ New event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Event name</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Summer rooftop party" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={3} className="w-full px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tell your guests what to expect" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
              <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={300} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="123 Main St" />
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium mb-1">Date</label>
              <input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventTime" className="block text-sm font-medium mb-1">Time</label>
              <input id="eventTime" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((em) => (
                  <button key={em} type="button" onClick={() => setCoverEmoji(em)} className={`w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${coverEmoji === em ? 'border-primary bg-primary/10' : 'border-ink/10 hover:border-ink/30'}`} aria-label={`Select emoji ${em}`}>{em}</button>
                ))}
              </div>
            </div>
          </div>
          {formError && <p className="text-red-600 text-sm border border-red-300 bg-red-50 px-3 py-2 rounded-lg" role="alert">{formError}</p>}
          <button type="submit" disabled={formLoading} className="bg-primary text-white font-mono font-medium min-h-[44px] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
            {formLoading ? 'Creating…' : 'Create event'}
          </button>
        </form>
      )}

      {events.length === 0 && !showForm ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎈</div>
          <h2 className="font-serif text-2xl font-semibold mb-2">No events yet</h2>
          <p className="text-ink/60 mb-6">Create your first event and start collecting RSVPs.</p>
          <button onClick={() => setShowForm(true)} className="bg-primary text-white font-mono font-medium min-h-[44px] px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary">Create your first event</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white border border-ink/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-4xl">{ev.cover_emoji}</div>
              <div className="flex-1">
                <h2 className="font-serif text-xl font-semibold">{ev.title}</h2>
                <p className="text-ink/60 text-sm">
                  {new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {ev.event_time ? ` at ${ev.event_time}` : ''}
                  {ev.location ? ` · ${ev.location}` : ''}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setSelectedEvent(ev); fetchRsvps(ev.id); }} className="border-2 border-primary-dark text-primary-dark font-mono text-sm min-h-[44px] px-4 py-2 rounded-lg hover:bg-primary-dark/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">View RSVPs</button>
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/e/${ev.share_slug}`); }} className="border-2 border-ink/20 text-ink font-mono text-sm min-h-[44px] px-4 py-2 rounded-lg hover:bg-ink/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Copy link</button>
                <button onClick={() => handleDeleteEvent(ev.id)} className="border-2 border-red-300 text-red-600 font-mono text-sm min-h-[44px] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="mt-8 bg-white border border-ink/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold">{selectedEvent.cover_emoji} {selectedEvent.title} — Guest list</h2>
            <button onClick={() => { setSelectedEvent(null); setRsvps([]); }} className="text-ink/40 hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Close guest list">&times;</button>
          </div>
          {rsvpLoading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status"><span className="sr-only">Loading RSVPs</span></div></div>
          ) : rsvps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-ink/60">No RSVPs yet. Share your event link to start collecting responses.</p>
            </div>
          ) : (
            <div>
              <div className="flex gap-4 mb-4 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{rsvps.filter(r => r.status === 'going').length} going</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">{rsvps.filter(r => r.status === 'maybe').length} maybe</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">{rsvps.filter(r => r.status === 'cant_go').length} can't go</span>
              </div>
              <ul className="divide-y divide-ink/10">
                {rsvps.map((r) => (
                  <li key={r.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{r.guest_name}</p>
                      <p className="text-ink/40 text-sm">{r.guest_email}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(r.status)}`}>{statusLabel(r.status)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}