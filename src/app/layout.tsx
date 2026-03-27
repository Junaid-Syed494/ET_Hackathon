import "./globals.css";

export const metadata = {
    title: "ET Intelligence",
    description: "Personalized Business News Prototype",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}