import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to get random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get random item from array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('🌱 Seeding database with rich mock data...\n');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.reelCommentLike.deleteMany({});
  await prisma.reelComment.deleteMany({});
  await prisma.reelLike.deleteMany({});
  await prisma.reel.deleteMany({});
  await prisma.highlightStory.deleteMany({});
  await prisma.highlight.deleteMany({});
  await prisma.storyLike.deleteMany({});
  await prisma.storyView.deleteMany({});
  await prisma.story.deleteMany({});
  await prisma.commentLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.savedPost.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Cleared all data\n');

  const hashedPassword = await bcrypt.hash('1', 10);

  // ===== USERS =====
  console.log('👥 Creating users...');
  
  const usersData = [
    { username: '1', fullName: 'Demo User', bio: '✨ Welcome to Socialy!\n📸 Photographer & Content Creator\n🌍 Tel Aviv, Israel', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
    { username: 'sarah_adventures', fullName: 'Sarah Cohen', bio: '🌍 Travel Blogger\n✈️ 50+ countries\n📍 Currently in Bali 🌴', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    { username: 'chef_david', fullName: 'David Levy', bio: '👨‍🍳 Professional Chef\n🍕 Italian & Mediterranean\n📺 Cooking Show Host', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
    { username: 'maya_fitness', fullName: 'Maya Rosen', bio: '💪 Fitness Coach\n🏋️ Personal Trainer\n🥗 Healthy Lifestyle\n📱 DM for programs!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    { username: 'tech_guy_avi', fullName: 'Avi Goldstein', bio: '💻 Software Developer\n🚀 Startup Founder\n🎮 Gamer\n☕ Coffee Addict', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
    { username: 'noa_music', fullName: 'Noa Mizrahi', bio: '🎵 Singer & Songwriter\n🎸 Indie/Pop\n🎤 Next show: Feb 15\n🔗 Spotify in bio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
    { username: 'art_by_yael', fullName: 'Yael Ben-David', bio: '🎨 Digital Artist\n✨ Commissions OPEN\n🖼️ NFT Artist\n📧 art@yael.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' },
    { username: 'daniel_photo', fullName: 'Daniel Shapiro', bio: '📷 Professional Photographer\n🌅 Landscape & Portrait\n📍 Based in Jerusalem\n💼 Bookings open', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    { username: 'tal_fashion', fullName: 'Tal Avraham', bio: '👗 Fashion Influencer\n💄 Beauty Tips\n🛍️ Shopping Hauls\n✉️ Collabs: tal@fashion.co', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop' },
    { username: 'lior_gaming', fullName: 'Lior Katz', bio: '🎮 Pro Gamer\n🏆 Esports Champion 2024\n📺 Streaming Daily\n🎯 Valorant & LoL', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop' },
    { username: 'michal_yoga', fullName: 'Michal Stern', bio: '🧘 Yoga Instructor\n🕉️ Mindfulness Coach\n🌿 Vegan Lifestyle\n📍 Retreat in Goa', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
    { username: 'ron_cars', fullName: 'Ron Peretz', bio: '🚗 Car Enthusiast\n🏎️ Automotive Journalist\n📸 Car Photography\n🔧 DIY Mechanic', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
    { username: 'shira_pets', fullName: 'Shira Blum', bio: '🐕 Dog Trainer\n🐱 Cat Mom x3\n🦜 Animal Rescue\n💕 Adopt Don\'t Shop', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop' },
    { username: 'omer_sports', fullName: 'Omer Hadad', bio: '⚽ Football Player\n🏀 Sports Analyst\n📊 Stats Nerd\n🎙️ Podcast Host', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop' },
    { username: 'eden_nature', fullName: 'Eden Naor', bio: '🌿 Nature Explorer\n🦋 Wildlife Photographer\n🏕️ Camping Expert\n🌲 Forest Therapy', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop' },
  ];

  const allUsers = [];
  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    allUsers.push(user);
  }
  
  const demoUser = allUsers[0];
  const otherUsers = allUsers.slice(1);
  
  console.log(`✅ Created ${allUsers.length} users\n`);

  // ===== FOLLOWS =====
  console.log('🔗 Creating follow relationships...');
  
  // Demo user follows everyone
  for (const user of otherUsers) {
    await prisma.follow.create({
      data: { followerId: demoUser.id, followingId: user.id },
    });
  }
  
  // Most users follow demo user back
  for (const user of otherUsers.slice(0, 10)) {
    await prisma.follow.create({
      data: { followerId: user.id, followingId: demoUser.id },
    });
  }
  
  // Create random follows between other users
  for (const user of otherUsers) {
    const toFollow = getRandomItems(otherUsers.filter(u => u.id !== user.id), Math.floor(Math.random() * 8) + 3);
    for (const followUser of toFollow) {
      try {
        await prisma.follow.create({
          data: { followerId: user.id, followingId: followUser.id },
        });
      } catch (e) {
        // Skip if already exists
      }
    }
  }
  
  console.log('✅ Created follow relationships\n');

  // ===== POSTS =====
  console.log('📸 Creating posts...');
  
  const postCaptions = [
    'Living my best life ✨',
    'Perfect day for this! 🌞',
    'Can\'t believe this view 😍',
    'Throwback to this amazing moment 💫',
    'Grateful for everything 🙏',
    'Making memories 📸',
    'This is happiness 💕',
    'Adventure awaits! 🚀',
    'Good vibes only ☀️',
    'Dreams do come true ⭐',
    'Blessed and grateful 🌸',
    'Living in the moment 🌈',
    'Best day ever! 🎉',
    'Can\'t stop smiling 😊',
    'Love this place! ❤️',
    'Weekend mood 🎶',
    'Pure magic ✨',
    'Life is beautiful 🌺',
    'Chasing sunsets 🌅',
    'Paradise found 🏝️',
  ];

  const postImages = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1682686581498-5e85c7228f43?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518173946687-a4c036bc3d10?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1482049016gy-2f84a1f456da?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=600&h=600&fit=crop',
  ];

  const allPosts = [];
  
  // Create posts for demo user (12 posts)
  for (let i = 0; i < 12; i++) {
    const post = await prisma.post.create({
      data: {
        userId: demoUser.id,
        image: postImages[i % postImages.length],
        caption: getRandomItem(postCaptions),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
    allPosts.push(post);
  }

  // Create posts for other users (3-8 posts each)
  for (const user of otherUsers) {
    const postCount = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < postCount; i++) {
      const post = await prisma.post.create({
        data: {
          userId: user.id,
          image: getRandomItem(postImages),
          caption: getRandomItem(postCaptions),
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        },
      });
      allPosts.push(post);
    }
  }

  console.log(`✅ Created ${allPosts.length} posts\n`);

  // ===== LIKES =====
  console.log('❤️ Creating likes...');
  
  let likeCount = 0;
  for (const post of allPosts) {
    const likers = getRandomItems(allUsers, Math.floor(Math.random() * 10) + 2);
    for (const liker of likers) {
      if (liker.id !== post.userId) {
        try {
          await prisma.like.create({
            data: { userId: liker.id, postId: post.id },
          });
          likeCount++;
        } catch (e) {}
      }
    }
  }
  
  console.log(`✅ Created ${likeCount} likes\n`);

  // ===== COMMENTS =====
  console.log('💬 Creating comments...');
  
  const commentTexts = [
    'Amazing! 🔥',
    'Love this! 😍',
    'So beautiful! ✨',
    'Goals! 🙌',
    'Stunning! 💕',
    'Wow! Just wow! 😮',
    'This is incredible!',
    'Perfect shot! 📸',
    'You\'re amazing! ❤️',
    'Can\'t get over this!',
    'Absolutely gorgeous!',
    'This made my day! 🌟',
    'So inspiring! 💪',
    'Living for this! 🔥',
    'Need to try this!',
    'Take me there! ✈️',
    'What a view! 🌅',
    'This is everything! 💯',
    'You killed it! 🎉',
    'Major vibes! ✌️',
    'Obsessed! 😍',
    'Keep shining! ⭐',
    'Queen/King! 👑',
    'So proud of you!',
    'This is art! 🎨',
  ];

  const allComments = [];
  for (const post of allPosts) {
    const commenters = getRandomItems(allUsers.filter(u => u.id !== post.userId), Math.floor(Math.random() * 6) + 1);
    for (const commenter of commenters) {
      const comment = await prisma.comment.create({
        data: {
          userId: commenter.id,
          postId: post.id,
          text: getRandomItem(commentTexts),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      });
      allComments.push(comment);
    }
  }

  console.log(`✅ Created ${allComments.length} comments\n`);

  // ===== COMMENT LIKES =====
  console.log('👍 Creating comment likes...');
  
  let commentLikeCount = 0;
  for (const comment of allComments) {
    const likers = getRandomItems(allUsers, Math.floor(Math.random() * 4));
    for (const liker of likers) {
      if (liker.id !== comment.userId) {
        try {
          await prisma.commentLike.create({
            data: { userId: liker.id, commentId: comment.id },
          });
          commentLikeCount++;
        } catch (e) {}
      }
    }
  }

  console.log(`✅ Created ${commentLikeCount} comment likes\n`);

  // ===== SAVED POSTS =====
  console.log('🔖 Creating saved posts...');
  
  const savedPosts = getRandomItems(allPosts, 15);
  for (const post of savedPosts) {
    if (post.userId !== demoUser.id) {
      try {
        await prisma.savedPost.create({
          data: { userId: demoUser.id, postId: post.id },
        });
      } catch (e) {}
    }
  }

  console.log('✅ Created saved posts\n');

  // ===== STORIES =====
  console.log('📖 Creating stories...');
  
  const storyImages = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=720&h=1280&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=720&h=1280&fit=crop',
  ];

  const musicOptions = [
    'Taylor Swift - Anti-Hero',
    'The Weeknd - Blinding Lights',
    'Dua Lipa - Levitating',
    'Ed Sheeran - Shape of You',
    'Harry Styles - As It Was',
    'Beyoncé - CUFF IT',
    'Drake - One Dance',
    'Billie Eilish - Bad Guy',
    null,
    null,
  ];

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const expiresAtHighlights = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const allStories = [];
  
  // Demo user stories
  for (let i = 0; i < 4; i++) {
    const story = await prisma.story.create({
      data: {
        userId: demoUser.id,
        image: storyImages[i],
        music: getRandomItem(musicOptions),
        expiresAt,
      },
    });
    allStories.push(story);
  }

  // Stories for other users (1-3 each for about half of users)
  for (const user of otherUsers.slice(0, 8)) {
    const storyCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < storyCount; i++) {
      const story = await prisma.story.create({
        data: {
          userId: user.id,
          image: getRandomItem(storyImages),
          music: getRandomItem(musicOptions),
          expiresAt,
        },
      });
      allStories.push(story);
    }
  }

  console.log(`✅ Created ${allStories.length} stories\n`);

  // ===== STORY VIEWS =====
  console.log('👁️ Creating story views...');
  
  for (const story of allStories) {
    if (story.userId !== demoUser.id) {
      // Demo user viewed most stories
      if (Math.random() > 0.3) {
        await prisma.storyView.create({
          data: { userId: demoUser.id, storyId: story.id },
        });
      }
    }
    // Random users viewed stories
    const viewers = getRandomItems(allUsers.filter(u => u.id !== story.userId), Math.floor(Math.random() * 5));
    for (const viewer of viewers) {
      try {
        await prisma.storyView.create({
          data: { userId: viewer.id, storyId: story.id },
        });
      } catch (e) {}
    }
  }

  console.log('✅ Created story views\n');

  // ===== HIGHLIGHTS =====
  console.log('⭐ Creating highlights...');

  const highlightData = [
    { name: 'Travel', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop' },
    { name: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop' },
    { name: 'Fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop' },
    { name: 'Music', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop' },
    { name: 'Friends', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&h=150&fit=crop' },
    { name: 'Nature', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150&h=150&fit=crop' },
  ];

  // Create stories specifically for highlights (longer expiry)
  const highlightStories = [];
  for (let i = 0; i < 12; i++) {
    const story = await prisma.story.create({
      data: {
        userId: demoUser.id,
        image: storyImages[i % storyImages.length],
        music: getRandomItem(musicOptions),
        expiresAt: expiresAtHighlights,
      },
    });
    highlightStories.push(story);
  }

  for (let i = 0; i < highlightData.length; i++) {
    await prisma.highlight.create({
      data: {
        userId: demoUser.id,
        name: highlightData[i].name,
        image: highlightData[i].image,
        stories: {
          create: [
            { storyId: highlightStories[i * 2].id },
            { storyId: highlightStories[i * 2 + 1].id },
          ],
        },
      },
    });
  }

  console.log('✅ Created highlights\n');

  // ===== MESSAGES =====
  console.log('💌 Creating messages...');

  const messageTexts = [
    'Hey! How are you? 😊',
    'Did you see my new post?',
    'That photo is amazing! 📸',
    'We should meet up soon!',
    'Miss you! ❤️',
    'Happy birthday! 🎂🎉',
    'Thanks for the follow!',
    'Love your content!',
    'When are you free?',
    'Check out this place!',
    'So excited for the weekend!',
    'Can you send me that recipe?',
    'Great workout today! 💪',
    'See you tomorrow!',
    'That was so much fun!',
    'I\'m on my way!',
    'Just saw your story!',
    'You look amazing!',
    'Let\'s plan a trip together! ✈️',
    'Good morning! ☀️',
  ];

  // Create conversations between demo user and other users
  for (const user of otherUsers.slice(0, 10)) {
    const messageCount = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < messageCount; i++) {
      const isFromDemo = Math.random() > 0.4;
      await prisma.message.create({
        data: {
          senderId: isFromDemo ? demoUser.id : user.id,
          receiverId: isFromDemo ? user.id : demoUser.id,
          text: getRandomItem(messageTexts),
          read: i < messageCount - 2,
          createdAt: new Date(Date.now() - (messageCount - i) * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log('✅ Created messages\n');

  // ===== REELS =====
  console.log('🎬 Creating reels...');

  const reelData = [
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: 'Amazing fire show! 🔥 #fire #show #amazing' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption: 'Adventure awaits! 🏔️ #adventure #travel #explore' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption: 'Fun times with friends! 🎉 #fun #friends #party' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption: 'Road trip vibes 🚗💨 #roadtrip #travel #vibes' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', caption: 'Behind the scenes 🎬 #bts #film #cinema' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', caption: 'Epic moments! ⚔️ #epic #fantasy #movie' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', caption: 'Off-road adventure! 🚙🏞️ #offroad #adventure #car' },
    { video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', caption: 'Sci-fi vibes 🤖 #scifi #future #tech' },
  ];

  const allReels = [];
  
  // Create reels for demo user
  for (let i = 0; i < 3; i++) {
    const reel = await prisma.reel.create({
      data: {
        userId: demoUser.id,
        video: reelData[i].video,
        thumbnail: `https://picsum.photos/seed/reel${i}/300/533`,
        caption: reelData[i].caption,
      },
    });
    allReels.push(reel);
  }

  // Create reels for other users
  for (let i = 0; i < 8; i++) {
    const reel = await prisma.reel.create({
      data: {
        userId: getRandomItem(otherUsers).id,
        video: reelData[i % reelData.length].video,
        thumbnail: `https://picsum.photos/seed/reel${i + 10}/300/533`,
        caption: reelData[i % reelData.length].caption,
      },
    });
    allReels.push(reel);
  }

  console.log(`✅ Created ${allReels.length} reels\n`);

  // ===== REEL LIKES =====
  console.log('❤️ Creating reel likes...');
  
  for (const reel of allReels) {
    const likers = getRandomItems(allUsers, Math.floor(Math.random() * 8) + 3);
    for (const liker of likers) {
      if (liker.id !== reel.userId) {
        try {
          await prisma.reelLike.create({
            data: { userId: liker.id, reelId: reel.id },
          });
        } catch (e) {}
      }
    }
  }

  console.log('✅ Created reel likes\n');

  // ===== REEL COMMENTS =====
  console.log('💬 Creating reel comments...');

  const reelCommentTexts = [
    'This is insane! 🔥',
    'Best reel I\'ve seen today!',
    'How do you do this?! 😮',
    'Obsessed with this! 💕',
    'Need more of this content!',
    'You\'re so talented! ⭐',
    'This made my day!',
    'Following for more!',
    'Incredible! 🙌',
    'Wow just wow!',
  ];

  const allReelComments = [];
  for (const reel of allReels) {
    const commenters = getRandomItems(allUsers.filter(u => u.id !== reel.userId), Math.floor(Math.random() * 5) + 2);
    for (const commenter of commenters) {
      const comment = await prisma.reelComment.create({
        data: {
          userId: commenter.id,
          reelId: reel.id,
          text: getRandomItem(reelCommentTexts),
        },
      });
      allReelComments.push(comment);
    }
  }

  console.log(`✅ Created ${allReelComments.length} reel comments\n`);

  // ===== FINAL SUMMARY =====
  console.log('═'.repeat(50));
  console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
  console.log('═'.repeat(50));
  console.log(`
📊 Summary:
   👥 Users: ${allUsers.length}
   📸 Posts: ${allPosts.length}
   ❤️ Likes: ${likeCount}
   💬 Comments: ${allComments.length}
   📖 Stories: ${allStories.length + highlightStories.length}
   ⭐ Highlights: ${highlightData.length}
   💌 Messages: Multiple conversations
   🎬 Reels: ${allReels.length}

🔐 Login credentials:
   Username: 1
   Password: 1
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
