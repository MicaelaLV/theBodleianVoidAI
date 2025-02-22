import React from 'react';

interface VideoPlayerProps {
  autoplay?: string;
  height?: string;
  loop?: boolean;
  muted?: boolean;
  playsinline?: boolean;
  preload?: boolean;
  src: string;
  width?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, width, height }) => {
  return (
    <div className="video-wrapper">
      <video preload='false' autoPlay playsInline muted loop width={width} height={height} controls>
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
