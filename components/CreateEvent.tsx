"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const POPULAR_TAGS = ["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "GraphQL", "AI", "Web3", "DevOps", "Cloud"];
const POPULAR_AGENDA = ["Keynote", "Workshop", "Panel Discussion", "Networking", "Lunch Break", "Q&A", "Closing Ceremony", "Hackathon"];

interface EventForm {
  title: string;
  description: string;
  overview: string;
  image: File | null;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string;
  organizer: string;
  tags: string;
}

const CreateEvent: React.FC = () => {
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    overview: '',
    image: null,
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: '',
    audience: '',
    agenda: '[]',
    organizer: '',
    tags: '[]',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [tagInput, setTagInput] = useState('');
  const [agendaInput, setAgendaInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAgenda, setSelectedAgenda] = useState<string[]>([]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      tags: JSON.stringify(selectedTags),
      agenda: JSON.stringify(selectedAgenda),
    }));
  }, [selectedTags, selectedAgenda]);

  const handleAddTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    e?.preventDefault();
    const val = tagInput.trim();
    if (val && !selectedTags.includes(val)) {
      setSelectedTags([...selectedTags, val]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setSelectedTags(selectedTags.filter((t) => t !== tag));

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) removeTag(tag);
    else setSelectedTags([...selectedTags, tag]);
  };

  const handleAddAgenda = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    e?.preventDefault();
    const val = agendaInput.trim();
    if (val && !selectedAgenda.includes(val)) {
      setSelectedAgenda([...selectedAgenda, val]);
      setAgendaInput('');
    }
  };

  const removeAgenda = (item: string) => setSelectedAgenda(selectedAgenda.filter((a) => a !== item));

  const toggleAgenda = (item: string) => {
    if (selectedAgenda.includes(item)) removeAgenda(item);
    else setSelectedAgenda([...selectedAgenda, item]);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  // Submit event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (selectedTags.length === 0) {
      setError('Please select at least one tag');
      setLoading(false);
      return;
    }
    if (selectedAgenda.length === 0) {
      setError('Please add at least one agenda item');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formData.append('file', value);
        } else {
          formData.append(key, value);
        }
      });
      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create event');
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-8 text-white text-center tracking-tight">Create Event</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Event Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Next.js Conf" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all [color-scheme:dark]" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all [color-scheme:dark]" />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description for the card..." required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all h-24 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Overview</label>
            <textarea name="overview" value={form.overview} onChange={handleChange} placeholder="Detailed event overview..." required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all h-32 resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Venue</label>
                <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Moscone Center" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Mode</label>
                <select name="mode" value={form.mode} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all [&>option]:bg-black">
                  <option value="" disabled>Select Mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Audience</label>
                <input name="audience" value={form.audience} onChange={handleChange} placeholder="e.g. Developers" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all" />
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Organizer</label>
            <input name="organizer" value={form.organizer} onChange={handleChange} placeholder="Organizer Name" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Tags</label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span key={tag} onClick={() => removeTag(tag)} className="bg-[#5dfeca] text-black px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-[#5dfeca]/80 transition-colors flex items-center gap-1">
                      {tag} &times;
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add custom tag..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all"
                  />
                  <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${selectedTags.includes(tag) ? 'bg-[#5dfeca]/20 border-[#5dfeca] text-[#5dfeca]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Agenda</label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedAgenda.map((item) => (
                    <span key={item} onClick={() => removeAgenda(item)} className="bg-[#5dfeca] text-black px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-[#5dfeca]/80 transition-colors flex items-center gap-1">
                      {item} &times;
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={agendaInput}
                    onChange={(e) => setAgendaInput(e.target.value)}
                    onKeyDown={handleAddAgenda}
                    placeholder="Add agenda item..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#5dfeca] focus:ring-1 focus:ring-[#5dfeca] transition-all"
                  />
                  <button type="button" onClick={handleAddAgenda} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_AGENDA.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAgenda(item)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${selectedAgenda.includes(item) ? 'bg-[#5dfeca]/20 border-[#5dfeca] text-[#5dfeca]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-1.5">Cover Image</label>
             <div className="relative">
                <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5dfeca] file:text-black hover:file:bg-[#5dfeca]/90 cursor-pointer" />
             </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-4 rounded-xl bg-[#5dfeca] text-black font-bold text-lg transition-all hover:bg-[#5dfeca]/90 hover:shadow-[0_0_20px_rgba(93,254,202,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        {error && <p className="mt-4 text-center text-red-400 font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
      </form>
    </div>
  );
};

export default CreateEvent;
