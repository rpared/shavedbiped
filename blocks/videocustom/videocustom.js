/*
 * Video Block
 * Show a video referenced by a link in the query parameters
 * https://www.hlx.live/developer/block-collection/video
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function extractYouTubeVideoId(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('v');
}

function extractVimeoVideoId(url) {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').pop();
}

function embedYouTube(videoUrl, autoplay) {
  const videoId = extractYouTubeVideoId(videoUrl);
  const suffix = autoplay ? '&autoplay=1' : '';
  const embed = `/embed/${videoId}`;
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${embed}?rel=0&v=${videoId}${suffix}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedVimeo(videoUrl, autoplay, background) {
  const videoId = extractVimeoVideoId(videoUrl);
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      background: background ? '1' : '0',
    };
    suffix = `?${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${videoId}${suffix}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${source.split('.').pop()}`);
  video.append(sourceEl);

  return video;
}

const loadVideoEmbed = (block, link, autoplay, background) => {
  if (block.dataset.embedLoaded === 'true') return;

  const videoId = getQueryParam('video');
  if (!videoId) return;

  let videoElement;
  if (link.includes('youtube.com') || link.includes('youtu.be')) {
    videoElement = embedYouTube(videoId, autoplay, background);
  } else if (link.includes('vimeo.com')) {
    videoElement = embedVimeo(videoId, autoplay, background);
  } else {
    videoElement = getVideoElement(link, autoplay, background);
  }

  block.innerHTML = '';
  block.append(videoElement);
  block.dataset.embedLoaded = 'true';
};

// const loadVideoEmbed = (block, link, autoplay, background) => {
//   if (block.dataset.embedLoaded === 'true') {
//     return;
//   }
//   const url = new URL(link);

//   const isYoutube = link.includes('youtube') || link.includes('youtu.be');
//   const isVimeo = link.includes('vimeo');

//   if (isYoutube) {
//     const embedWrapper = embedYoutube(url, autoplay, background);
//     block.append(embedWrapper);
//     embedWrapper.querySelector('iframe').addEventListener('load', () => {
//       block.dataset.embedLoaded = true;
//     });
//   } else if (isVimeo) {
//     const embedWrapper = embedVimeo(url, autoplay, background);
//     block.append(embedWrapper);
//     embedWrapper.querySelector('iframe').addEventListener('load', () => {
//       block.dataset.embedLoaded = true;
//     });
//   } else {
//     const videoEl = getVideoElement(link, autoplay, background);
//     block.append(videoEl);
//     videoEl.addEventListener('canplay', () => {
//       block.dataset.embedLoaded = true;
//     });
//   }
// };

export default async function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';
  block.dataset.embedLoaded = false;

  const autoplay = block.classList.contains('autoplay');
  if (placeholder) {
    block.classList.add('placeholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'video-placeholder';
    wrapper.append(placeholder);

    if (!autoplay) {
      wrapper.insertAdjacentHTML(
        'beforeend',
        '<div class="video-placeholder-play"><button type="button" title="Play"></button></div>',
      );
      wrapper.addEventListener('click', () => {
        wrapper.remove();
        loadVideoEmbed(block, link, true, false);
      });
    }
    block.append(wrapper);
  }

  if (!placeholder || autoplay) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const playOnLoad = autoplay && !prefersReducedMotion.matches;
        loadVideoEmbed(block, link, playOnLoad, autoplay);
      }
    });
    observer.observe(block);
  }
}
