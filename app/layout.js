import "./globals.css";

export const metadata = {
  title: "Fieldnote",
  description: "Capture meeting notes, tag them, find them later.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="masthead">
            <h1>Fieldnote</h1>
            <p>Capture meeting notes, tag them, find them later.</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
