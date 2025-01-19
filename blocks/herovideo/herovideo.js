/*
 * Hero Video Block
 * Displays a full-screen, autoplay, looped video with no controls
 */
export default async function decorate(block) {
  // Get video link from a specified anchor tag in the block
  const link = block.querySelector('a')?.href;
  if (!link) {
    console.log('No video link found.');
    return;
  }

  // Convert Dropbox link to a direct downloadable link
  const directLink = link.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');

  // Clear the block content
  block.textContent = '';

  // Create a video element
  const video = document.createElement('video');
  video.setAttribute('autoplay', 'true');
  video.setAttribute('muted', 'true'); // Ensure autoplay works without user interaction
  video.muted = true;
  video.setAttribute('playsinline', 'true'); // For mobile compatibility
  video.setAttribute('preload', 'auto'); // Preload video for smoother playback
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';
  video.style.position = 'absolute';
  video.style.top = '0';
  video.style.left = '0';
  video.style.zIndex = '-1'; // Place the video behind other content

  // Add source to the video
  const source = document.createElement('source');
  source.setAttribute('src', directLink);
  source.setAttribute('type', 'video/mp4');
  video.appendChild(source);

  // Append the video to the block
  block.style.position = 'relative';
  block.style.overflow = 'hidden';
  block.style.width = '100%';
  block.style.height = '100vh';
  block.appendChild(video);

  // Explicitly attempt to play the video
  video.addEventListener('canplay', () => {
    video.play().catch((err) => {
      console.log('Autoplay failed:', err);
    });
  });

  // Debugging: Check if the video can autoplay
  console.log('Video autoplay:', video.autoplay);
  console.log('Video muted:', video.muted);
  console.log('Video playsinline:', video.playsInline);

  // Handle pausing and replaying after 3 seconds
  video.addEventListener('ended', () => {
    video.pause();
    setTimeout(() => {
      video.currentTime = 0; // Reset to the start
      video.play();
    }, 3000); // Pause for 3 seconds before looping
  });
}
