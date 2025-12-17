import { NextResponse } from 'next/server';

// Mock user data
const users = [
  {
    id: 1,
    username: 'orpaz_avdaev',
    fullName: 'Orpaz Avdaev',
    avatar: 'https://i.pravatar.cc/150?img=33',
    bio: 'Digital creator',
    posts: 27,
    followers: 137,
    following: 154,
  },
];

export async function GET() {
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Here you would add user creation logic
  return NextResponse.json({ 
    message: 'User creation endpoint',
    received: body 
  }, { status: 201 });
}

