document.addEventListener('mouseover', function(event) {
    if (event.target.tagName === 'A' && event.target.href.includes('youtube.com/watch')) {
      const url = new URL(event.target.href);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        fetchVideoDetails(videoId).then(details => {
          showTooltip(event.target, details);
        });
      }
    }
  });
  
  function fetchVideoDetails(videoId) {
    return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=AIzaSyB8PT2dQ-9TINmZ9M5iyrgqYUtIxjlkMe8`)
      .then(response => response.json())
      .then(data => {
        const video = data.items[0];
        return {
          title: video.snippet.title,
          views: video.statistics.viewCount,
          length: formatDuration(video.contentDetails.duration),
          likes: video.statistics.likeCount
        };
      });
  }
  
  function showTooltip(element, details) {
    let tooltip = document.createElement('div');
    tooltip.className = 'youtube-tooltip';
    tooltip.innerHTML = `
      <p><strong>Title:</strong> ${details.title}</p>
      <p><strong>Views:</strong> ${details.views}</p>
      <p><strong>Length:</strong> ${details.length}</p>
      <p><strong>Likes:</strong> ${details.likes}</p>
    `;
    document.body.appendChild(tooltip);
  
    let rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom}px`;
  
    element.addEventListener('mouseout', () => {
      tooltip.remove();
    });
  }
  
  function formatDuration(duration) {
    // Parses ISO 8601 duration format
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = (parseInt(match[1]) || 0);
    let minutes = (parseInt(match[2]) || 0);
    let seconds = (parseInt(match[3]) || 0);
    return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
  }
  
  // Add some basic CSS for the tooltip
  const style = document.createElement('style');
  style.innerHTML = `
    .youtube-tooltip {
      position: absolute;
      background: white;
      border: 1px solid black;
      padding: 5px;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 0 5px rgba(0,0,0,0.3);
      font-size: 12px;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);

  