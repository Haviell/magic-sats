import { NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email/resend'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const supabase = createClient()

    // Gera o link seguro de recuperação via Supabase Auth
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { data, error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${appUrl}/auth/redefinir-senha`,
    })

    if (error) {
      console.error('Erro ao gerar reset token:', error)
      // Resposta genérica para evitar enumeração de usuários (proteção de privacidade)
      return NextResponse.json({
        message: 'Se este e-mail estiver cadastrado, as instruções foram enviadas com sucesso.',
      })
    }

    // Busca o nickname correspondente para personalizar sem expor dados
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', (data as any)?.user?.id || '')
      .single()

    const nickname = profile?.username || normalizedEmail.split('@')[0]
    const resetUrl = `${appUrl}/auth/redefinir-senha`

    // Envio anônimo via Resend
    await sendPasswordResetEmail({
      to: normalizedEmail,
      nickname,
      resetUrl,
    })

    return NextResponse.json({
      success: true,
      message: 'Se este e-mail estiver cadastrado, as instruções foram enviadas com sucesso.',
    })
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: 'Erro ao processar solicitação.' }, { status: 500 })
  }
}
