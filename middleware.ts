import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface JWTPayload {
  id: string
  iat: string
  exp: number
  sub: string
  data: {
    id: number
    nome: string
    email: string
    admin: boolean
    superadmin: boolean
    idempresa: number
    empresa: string
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('https://painel.stratustelecom.com.br/main/login.php', request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const response = NextResponse.next()
    response.headers.set('x-user-id', decoded.data.id.toString())
    response.headers.set('x-user-name', decoded.data.nome)

    return response
  } catch (err) {
    console.error('JWT inválido:', err)

    return NextResponse.redirect(new URL('https://painel.stratustelecom.com.br/main/login.php', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
