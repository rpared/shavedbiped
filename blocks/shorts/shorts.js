export default function decorate(block) {
  const videos = [...block.querySelectorAll('a')]; // Assume each video link is wrapped in an anchor tag
  const numColumns = 3;

  // Clear the block content
  block.innerHTML = '';

  // Set block class for styling
  block.classList.add(`video-columns-${numColumns}-cols`);

  // Create a wrapper for the videos
  const wrapper = document.createElement('div');
  wrapper.className = 'video-columns-wrapper';
  block.append(wrapper);

  // Add videos directly to the wrapper (no rows)
  videos.forEach((videoLink) => {
    const col = document.createElement('div');
    col.className = 'video-col';

    // Embed the YouTube video iframe
    const url = new URL(videoLink.href);
    const youtubeId = url.searchParams.get('v') || url.pathname.split('/').pop();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    iframe.style.border = '0';
    iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    col.append(iframe);
    wrapper.append(col); // Append each video column directly to the wrapper
  });
}
