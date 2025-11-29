import { NextResponse } from 'next/server';

export async function POST() {
  // For stateless JWT, logout is handled client-side by removing the token
  // In the future, we could implement token blacklisting if needed
  return NextResponse.json({ success: true });
}
