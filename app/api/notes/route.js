import { addNote, listNotes } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const tag = searchParams.get("tag");

  let results = listNotes();

  if (query) {
    results = results.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }

  if (tag) {
    results = results.filter((note) => note.tags.includes(tag));
  }

  return Response.json({ notes: results, count: results.length });
}

export async function POST(request) {
  const payload = await request.json();

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const content =
    typeof payload.content === "string" ? payload.content.trim() : "";

  if (!title) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  if (!content) {
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  if (title.length > 120) {
    return Response.json(
      { error: "Title must be 120 characters or fewer" },
      { status: 400 }
    );
  }

  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
    : [];

  const note = addNote({ title, content, tags });
  return Response.json({ note }, { status: 201 });
}
