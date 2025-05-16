// /hoan-thanh/page.tsx (server component)
import ConfirmOrderClient from './ConfirmOrderClient'

export const dynamic = 'force-dynamic'; // Bắt buộc dynamic rendering (không prerender)

export default function Page() {
  return <ConfirmOrderClient />
}
