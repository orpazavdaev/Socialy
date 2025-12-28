import Image from 'next/image';

interface PostImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Image component that handles both regular URLs and base64 data URLs.
 * Uses regular img tag for base64 to avoid Next.js Image optimization issues.
 */
export default function PostImage({ 
  src, 
  alt, 
  fill = true, 
  className = 'object-cover',
  sizes,
  priority = false,
}: PostImageProps) {
  // Check if image is base64 encoded
  const isBase64 = src?.startsWith('data:');

  if (isBase64) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

