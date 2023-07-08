import './globals.css'

export const metadata = {
  title: 'Mausam',
  description: 'aapka apna mausam app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
