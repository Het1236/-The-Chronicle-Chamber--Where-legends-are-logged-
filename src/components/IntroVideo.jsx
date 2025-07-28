import { useState, useEffect } from 'react';
import introVideo from '../assets/IntroVideo.mp4';

const IntroVideo = ({ onVideoEnd }) => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  useEffect(() => {
    // If video has ended, call the callback
    if (isVideoEnded) {
      onVideoEnd();
    }
  }, [isVideoEnded, onVideoEnd]);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <video
        className="w-full h-full object-cover"
        src={introVideo}
        autoPlay
        muted={false}
        playsInline
        onEnded={handleVideoEnd}
      />
      <button 
        onClick={handleVideoEnd}
        className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors duration-300"
      >
        Skip Intro
      </button>
    </div>
  );
};

export default IntroVideo;