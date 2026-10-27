import { NextResponse } from 'next/server'
import { sendWinnerNotificationEmail } from '@/lib/email/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nickname, roundNumber, winningNumber, prizeSatoshis } = body

    if (!email || !nickname || !roundNumber || !winningNumber) {
      return NextResponse.json({ error: 'Parâmetros incompletos.' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const claimUrl = `${appUrl}/rifa?round=${roundNumber + 1}&winnerNumber=${winningNumber}`

    const result = await sendWinnerNotificationEmail({
      to: email,
      nickname,
      roundNumber: Number(roundNumber),
      winningNumber: Number(winningNumber),
      prizeSatoshis: Number(prizeSatoshis) || 0,
      claimUrl,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Falha no envio.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    console.error('Winner alert error:', err)
    return NextResponse.json({ error: 'Erro interno ao disparar notificação.' }, { status: 500 })
  }
}
