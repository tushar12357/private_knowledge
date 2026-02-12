import "./globals.css";

export const metadata = {
  title: "Private Knowledge Q&A",
  description: "Ask questions from your private documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
