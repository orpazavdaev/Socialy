import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Instagram API',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/posts',
      '/api/comments',
      '/api/stories',
    ]
  });
}

