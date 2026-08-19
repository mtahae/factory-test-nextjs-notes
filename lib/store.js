// Simple in-memory store. Swapped for Postgres before launch; keeps local dev
// dependency-free in the meantime.

let sequence = 5;

const notes = [
  {
    id: 1,
    title: "Q3 planning kickoff",
    content:
      "Roadmap freeze on the 12th. Ops still owes us the headcount numbers before we can size the migration work.",
    tags: ["planning", "roadmap"],
    pinned: false,
    createdAt: "2026-03-02T09:14:00.000Z",
    updatedAt: "2026-03-02T09:14:00.000Z",
  },
  {
    id: 2,
    title: "Onboarding call - Meridian",
    content:
      "They want SSO on day one and a sandbox tenant for their security review. Follow up with a scoped trial plan.",
    tags: ["customer"],
    pinned: false,
    createdAt: "2026-03-05T13:40:00.000Z",
    updatedAt: "2026-03-06T08:02:00.000Z",
  },
  {
    id: 3,
    title: "Retro action items",
    content:
      "Cut the release checklist in half, move the staging smoke test into CI, stop hand-editing the changelog.",
    tags: ["team", "process"],
    pinned: false,
    createdAt: "2026-03-09T16:25:00.000Z",
    updatedAt: "2026-03-09T16:25:00.000Z",
  },
  {
    id: 4,
    title: "Billing edge cases to check",
    content:
      "Proration on mid-cycle downgrades, and what happens when a card fails on the same day as a plan change.",
    tags: ["billing"],
    pinned: false,
    createdAt: "2026-03-11T11:05:00.000Z",
    updatedAt: "2026-03-11T11:05:00.000Z",
  },
];

// Display order: pinned notes float to the top, then most recently touched.
export function listNotes() {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

export function findNote(id) {
  return notes.find((note) => note.id === id) ?? null;
}

export function addNote({ title, content, tags }) {
  const now = new Date().toISOString();
  const note = {
    id: sequence++,
    title,
    content,
    tags,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
  notes.push(note);
  return note;
}

export function patchNote(id, changes) {
  const note = findNote(id);
  if (!note) return null;
  Object.assign(note, changes, { updatedAt: new Date().toISOString() });
  return note;
}

export function removeNoteAt(index) {
  const [removed] = notes.splice(index, 1);
  return removed ?? null;
}
