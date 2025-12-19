import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronRight, Camera, Image as ImageIcon, Film } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

type CreateType = 'POST' | 'STORY' | 'REEL';

const sampleImages = [
  'https://picsum.photos/seed/create1/400/400',
  'https://picsum.photos/seed/create2/400/400',
  'https://picsum.photos/seed/create3/400/400',
  'https://picsum.photos/seed/create4/400/400',
  'https://picsum.photos/seed/create5/400/400',
  'https://picsum.photos/seed/create6/400/400',
  'https://picsum.photos/seed/create7/400/400',
  'https://picsum.photos/seed/create8/400/400',
];

export default function CreatePage() {
  const router = useRouter();
  const { post, isLoading } = useApi();
  const [createType, setCreateType] = useState<CreateType>('POST');
  const [selectedImage, setSelectedImage] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  const handleSelectImage = (url: string) => {
    setSelectedImage(url);
    setCustomImageUrl(url);
  };

  const handleSubmit = async () => {
    const imageUrl = customImageUrl || selectedImage;
    
    if (!imageUrl) {
      setError('Please select or enter an image URL');
      return;
    }

    setError('');

    if (createType === 'POST' || createType === 'REEL') {
      const result = await post('/api/posts', {
        image: imageUrl,
        caption: caption,
      });

      if (result) {
        router.push('/');
      } else {
        setError('Failed to create post');
      }
    } else if (createType === 'STORY') {
      const result = await post('/api/stories', {
        image: imageUrl,
      });

      if (result) {
        router.push('/');
      } else {
        setError('Failed to create story');
      }
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black sticky top-0 z-10">
        <Link href="/" className="text-white">
          <X className="w-6 h-6" />
        </Link>
        <span className="text-white font-semibold">
          New {createType.toLowerCase()}
        </span>
        <button 
          onClick={handleSubmit}
          disabled={isLoading || (!selectedImage && !customImageUrl)}
          className="text-blue-500 font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Share'}
        </button>
      </div>

      {/* Selected Image Preview */}
      <div className="relative aspect-square bg-gray-900 flex items-center justify-center">
        {selectedImage || customImageUrl ? (
          <Image
            src={customImageUrl || selectedImage}
            alt="Selected"
            fill
            className="object-contain"
            onError={() => setError('Invalid image URL')}
          />
        ) : (
          <div className="text-center text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-2" />
            <p>Select an image or enter URL</p>
          </div>
        )}
      </div>

      {/* Custom URL Input */}
      <div className="px-4 py-3 bg-gray-900">
        <input
          type="text"
          placeholder="Paste image URL here..."
          value={customImageUrl}
          onChange={(e) => {
            setCustomImageUrl(e.target.value);
            setSelectedImage('');
          }}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Caption Input */}
      <div className="px-4 py-3 bg-gray-900 border-t border-gray-800">
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Recents Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black">
        <span className="text-white font-medium">Or choose from samples:</span>
      </div>

      {/* Gallery Grid */}
      <div className="bg-black relative">
        <div className="grid grid-cols-4 gap-0.5">
          {sampleImages.map((image, index) => (
            <button 
              key={index} 
              className={`aspect-square relative ${selectedImage === image ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
              onClick={() => handleSelectImage(image)}
            >
              <Image
                src={image}
                alt={`Sample ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Floating Bottom Tabs */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-neutral-700/90 backdrop-blur-sm rounded-full p-1 flex gap-1">
            <button 
              onClick={() => setCreateType('POST')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                createType === 'POST' 
                  ? 'bg-neutral-500 text-white' 
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              POST
            </button>
            <button 
              onClick={() => setCreateType('STORY')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                createType === 'STORY' 
                  ? 'bg-neutral-500 text-white' 
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              STORY
            </button>
            <button 
              onClick={() => setCreateType('REEL')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                createType === 'REEL' 
                  ? 'bg-neutral-500 text-white' 
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              REEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
