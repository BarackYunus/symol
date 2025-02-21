export const metadata = {
  title: "Symol",
  description: "A cool app",
  icons: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href= "favicon.png"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
