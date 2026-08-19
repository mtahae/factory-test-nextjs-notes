"use client";

import { useCallback, useEffect, useState } from "react";
import NoteComposer from "./NoteComposer";

export default function NotesView() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (query, signal) => {
    setLoading(true);
    try {
      const url = query
        ? `/api/notes?q=${encodeURIComponent(query)}`
        : "/api/notes";
      const res = await fetch(url, { cache: "no-store", signal });
      const data = await res.json();
      setNotes(data.notes ?? []);
      setError("");
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError("Could not load notes.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(() => load(search, controller.signal), 200);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [search, load]);

  async function togglePin(note) {
    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !note.pinned }),
    });
    load(search);
  }

  async function remove(note) {
    await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    load(search);
  }

  return (
    <>
      <NoteComposer onCreated={() => load(search)} />

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search notes…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section className="card">
        {error && <p className="error">{error}</p>}
        {loading && notes.length === 0 && <p className="empty">Loading…</p>}
        {!loading && notes.length === 0 && (
          <p className="empty">No notes yet. Write the first one above.</p>
        )}

        {notes.map((note) => (
          <article className="note" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-meta">
              {note.pinned && <span className="pin-badge">PINNED</span>}
              {note.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
              <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              <button className="link" onClick={() => togglePin(note)}>
                {note.pinned ? "Unpin" : "Pin"}
              </button>
              <button className="link danger" onClick={() => remove(note)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
