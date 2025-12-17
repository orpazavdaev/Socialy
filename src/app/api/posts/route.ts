import { NextResponse } from 'next/server';

// Mock posts data
const posts = [
  {
    id: 1,
    userId: 1,
    image: 'https://picsum.photos/seed/post1/600/600',
    caption: 'Beautiful day!',
    likes: 124,
    comments: 12,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Here you would add post creation logic
  return NextResponse.json({ 
    message: 'Post creation endpoint',
    received: body 
  }, { status: 201 });
}

