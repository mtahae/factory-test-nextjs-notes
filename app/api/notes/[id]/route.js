import { findNote, listNotes, patchNote, removeNoteAt } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const note = findNote(Number(id));

  if (!note) {
    return Response.json({ error: "Note not found" }, { status: 404 });
  }

  return Response.json({ note });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const payload = await request.json();
  const changes = {};

  if (typeof payload.title === "string") changes.title = payload.title.trim();
  if (typeof payload.content === "string") changes.content = payload.content;
  if (typeof payload.pinned === "boolean") changes.pinned = payload.pinned;

  const note = patchNote(Number(id), changes);

  if (!note) {
    return Response.json({ error: "Note not found" }, { status: 404 });
  }

  return Response.json({ note });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const noteId = Number(id);

  const ordered = listNotes();
  const index = ordered.findIndex((note) => note.id === noteId);

  if (index === -1) {
    return Response.json({ error: "Note not found" }, { status: 404 });
  }

  const removed = removeNoteAt(index);
  return Response.json({ deleted: removed });
}
