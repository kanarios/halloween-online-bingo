import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Страшное Бинго | Halloween Bingo',
  description: 'Хэллоуинская игра в бинго со страхами для команды тестирования',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-haunted text-halloween-mist">
        {children}
      </body>
    </html>
  )
}
