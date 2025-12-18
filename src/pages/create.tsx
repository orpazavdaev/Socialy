import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronRight, Camera, Maximize2, Copy } from 'lucide-react';

const galleryImages = [
  'https://picsum.photos/seed/create1/400/400',
  'https://picsum.photos/seed/create2/400/400',
  'https://picsum.photos/seed/create3/400/400',
  'https://picsum.photos/seed/create4/400/400',
  'https://picsum.photos/seed/create5/400/400',
  'https://picsum.photos/seed/create6/400/400',
  'https://picsum.photos/seed/create7/400/400',
  'https://picsum.photos/seed/create8/400/400',
  'https://picsum.photos/seed/create9/400/400',
  'https://picsum.photos/seed/create10/400/400',
  'https://picsum.photos/seed/create11/400/400',
  'https://picsum.photos/seed/create12/400/400',
  'https://picsum.photos/seed/create13/400/400',
  'https://picsum.photos/seed/create14/400/400',
  'https://picsum.photos/seed/create15/400/400',
  'https://picsum.photos/seed/create16/400/400',
  'https://picsum.photos/seed/create17/400/400',
  'https://picsum.photos/seed/create18/400/400',
  'https://picsum.photos/seed/create19/400/400',
  'https://picsum.photos/seed/create20/400/400',
];

const selectedImage = 'https://picsum.photos/seed/window/600/600';

export default function CreatePage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black sticky top-0 z-10">
        <Link href="/" className="text-white">
          <X className="w-6 h-6" />
        </Link>
        <span className="text-white font-semibold">New post</span>
        <button className="text-blue-500 font-semibold">
          Next
        </button>
      </div>

      {/* Selected Image Preview */}
      <div className="relative aspect-square bg-gray-900">
        <Image
          src={selectedImage}
          alt="Selected"
          fill
          className="object-contain"
        />
        
        {/* Bottom left - Expand */}
        <button className="absolute bottom-4 left-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Recents Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black">
        <button className="flex items-center gap-1 text-white">
          <span className="font-medium">Recents</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </button>
        <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          <Copy className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Gallery Grid with floating tabs */}
      <div className="bg-black relative">
        <div className="grid grid-cols-4 gap-0.5">
          {/* Camera button */}
          <button className="aspect-square bg-gray-800 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </button>
          
          {/* Selected image thumbnail */}
          <div className="aspect-square relative ring-2 ring-white ring-inset">
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Other gallery images */}
          {galleryImages.slice(0, 2).map((image, index) => (
            <button key={index} className="aspect-square relative">
              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          
          {/* More images */}
          {galleryImages.slice(2).map((image, index) => (
            <button key={index + 2} className="aspect-square relative">
              <Image
                src={image}
                alt={`Gallery ${index + 3}`}
                fill
                className="object-cover"
              />
              {/* Duration badge for some */}
              {index === 0 && (
                <span className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 rounded">
                  1:18
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Floating Bottom Tabs */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-neutral-700/90 backdrop-blur-sm rounded-full p-1 flex gap-1">
            <button className="px-5 py-2 bg-neutral-500 rounded-full text-white text-xs font-semibold tracking-wide">
              POST
            </button>
            <button className="px-5 py-2 rounded-full text-neutral-300 text-xs font-semibold tracking-wide hover:text-white transition-colors">
              STORY
            </button>
            <button className="px-5 py-2 rounded-full text-neutral-300 text-xs font-semibold tracking-wide hover:text-white transition-colors">
              REEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
