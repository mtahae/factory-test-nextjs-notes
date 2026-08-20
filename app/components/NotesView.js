"use client";

import { useCallback, useEffect, useState } from "react";
import NoteComposer from "./NoteComposer";

export default function NotesView() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (query) => {
    setLoading(true);
    try {
      const url = query
        ? `/api/notes?q=${encodeURIComponent(query)}`
        : "/api/notes";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setNotes(data.notes ?? []);
      setError("");
    } catch {
      setError("Could not load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => load(search), 200);
    return () => clearTimeout(handle);
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

  function startEdit(note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }

  async function saveEdit(note) {
    const title = editTitle.trim();
    if (!title) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: editContent }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not save the note.");
        return;
      }
      cancelEdit();
      load(search);
    } catch {
      setError("Could not save the note.");
    } finally {
      setSaving(false);
    }
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
            {editingId === note.id ? (
              <div className="note-edit">
                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Content</label>
                  <textarea
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                  />
                </div>
                <div className="note-meta">
                  <button
                    className="primary"
                    onClick={() => saveEdit(note)}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button className="link" onClick={cancelEdit} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                  <button className="link" onClick={() => startEdit(note)}>
                    Edit
                  </button>
                  <button className="link" onClick={() => togglePin(note)}>
                    {note.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button className="link danger" onClick={() => remove(note)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
