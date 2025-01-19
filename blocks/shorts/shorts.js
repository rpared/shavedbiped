export default function decorate(block) {
  const videos = [...block.querySelectorAll('a')]; // Collect all video links

  // Clear the block content
  block.innerHTML = '';

  // Create both layouts
  const gridWrapper = createGrid(videos, 3); // 3 columns for larger devices
  const carouselWrapper = createCarousel(videos);

  // Append both layouts to the block
  block.appendChild(gridWrapper);
  block.appendChild(carouselWrapper);
}

function createGrid(videos, numColumns) {
  // Create a wrapper for the grid
  const wrapper = document.createElement('div');
  wrapper.className = `video-columns-wrapper grid-layout video-columns-${numColumns}-cols`;

  // Add each video as a grid column
  videos.forEach((videoLink) => {
    const col = document.createElement('div');
    col.className = 'video-col';

    // Extract YouTube ID and embed the iframe
    const url = new URL(videoLink.href);
    const youtubeId = url.searchParams.get('v') || url.pathname.split('/').pop();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    iframe.style.border = '0';
    iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    col.appendChild(iframe);
    wrapper.appendChild(col);
  });

  return wrapper;
}

function createCarousel(videos) {
  // Create carousel structure
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-layout';

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'carousel-slides-container';
  wrapper.appendChild(slidesWrapper);

  const slides = document.createElement('ul');
  slides.className = 'carousel-slides';
  slidesWrapper.appendChild(slides);

  // Add each video as a separate slide
  videos.forEach((videoLink, index) => {
    const slide = document.createElement('li');
    slide.className = 'carousel-slide';
    slide.dataset.slideIndex = index;

    // Extract YouTube ID and embed the iframe
    const url = new URL(videoLink.href);
    const youtubeId = url.searchParams.get('v') || url.pathname.split('/').pop();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    iframe.style.border = '0';
    iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    slide.appendChild(iframe);
    slides.appendChild(slide);
  });

  function getActiveSlide(wrapper) {
    return parseInt(wrapper.dataset.activeSlide || '0', 10);
  }
  
  function showSlide(wrapper, index) {
    const slides = wrapper.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    const newIndex = (index + totalSlides) % totalSlides;
  
    // Set the active slide index
    wrapper.dataset.activeSlide = newIndex;
  
    // Scroll to the active slide
    const slidesWrapper = wrapper.querySelector('.carousel-slides-container');
    slidesWrapper.scrollTo({
      left: slides[newIndex].offsetLeft,
      behavior: 'smooth',
    });
  }

  // Add navigation buttons
  const prevButton = document.createElement('button');
  prevButton.className = 'slide-prev';
  prevButton.textContent = '<';
  prevButton.addEventListener('click', () => showSlide(wrapper, getActiveSlide(wrapper) - 1));

  const nextButton = document.createElement('button');
  nextButton.className = 'slide-next';
  nextButton.textContent = '>';
  nextButton.addEventListener('click', () => showSlide(wrapper, getActiveSlide(wrapper) + 1));

  wrapper.appendChild(prevButton);
  wrapper.appendChild(nextButton);

  // Initialize carousel with the first slide active
  showSlide(wrapper, 0);

  return wrapper;
}
