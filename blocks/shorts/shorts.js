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
  
    // Group videos into rows of 3 columns
    for (let i = 0; i < videos.length; i += numColumns) {
      const row = document.createElement('div');
      row.className = 'video-row';
      wrapper.append(row);
  
      videos.slice(i, i + numColumns).forEach((videoLink) => {
        const col = document.createElement('div');
        col.className = 'video-col';
        row.append(col);
  
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
      });
    }
  }
  