import { NextResponse } from 'next/server';
import { publicRoute } from '@/lib/api/route-wrapper';

export const POST = publicRoute(
  async () => {
    // For stateless JWT, logout is handled client-side by removing the token
    // In the future, we could implement token blacklisting if needed
    return NextResponse.json({ success: true });
  },
  { errorLogPrefix: 'Logout' }
);
