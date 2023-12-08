import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function VideoScreen() {
  const [isPlaying, setIsPlaying] = useState(true); // State to keep track of whether the video is playing or not
  const videoRef = useRef(null); // Ref to access the video DOM element

  // Function to toggle video play/pause
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying); // Toggle the isPlaying state
    }
  };
  const navigate = useNavigate();

  const handleJoinUsClick = () => {
      navigate("/register");
  }

  return (
    <div className="video-container">
      <video ref={videoRef} className="background-video" autoPlay loop muted>
        <source src="../videos/backgroundvid.mp4" type="video/mp4" />
      </video>
      <div className="overlay-content">
        Connecting farmers , Cultivating progress
      </div>
    </div>
  );
}
