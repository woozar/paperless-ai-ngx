import { NextResponse } from 'next/server';
import { generateOpenAPIDocument } from '@/lib/api/openapi';
import '@/lib/api/schemas';

export async function GET(): Promise<NextResponse> {
  const spec = generateOpenAPIDocument();
  return NextResponse.json(spec);
}
