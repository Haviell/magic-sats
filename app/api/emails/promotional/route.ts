import { NextResponse } from 'next/server'
import { sendPromotionalCampaign } from '@/lib/email/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipients, subject, title, content, ctaText, ctaUrl, adminSecret } = body

    // Validação de segurança básica de autorização
    const serverSecret = process.env.ADMIN_SECRET || 'magic_sats_secret_key'
    if (adminSecret !== serverSecret) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
    }

    if (!Array.isArray(recipients) || recipients.length === 0 || !subject || !title || !content) {
      return NextResponse.json({ error: 'Dados da campanha inválidos.' }, { status: 400 })
    }

    // Processa o disparo anônimo (destinatários isolados individualmente)
    const result = await sendPromotionalCampaign({
      recipients,
      subject,
      title,
      body: content,
      ctaText,
      ctaUrl,
    })

    return NextResponse.json({
      success: true,
      totalSent: result.totalSent,
      errors: result.errors,
      message: `Campanha disparada com segurança: ${result.totalSent} enviados, ${result.errors} falhas.`,
    })
  } catch (err) {
    console.error('Promotional email error:', err)
    return NextResponse.json({ error: 'Falha ao processar campanha.' }, { status: 500 })
  }
}
