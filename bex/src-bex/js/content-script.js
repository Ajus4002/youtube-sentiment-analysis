// Content script content goes here or in activatedContentHooks (use activatedContentHooks if you need a variable
// accessible to both the content script and inside a hook

let analyseButton = null;
let iframe = null;

tryAddAnalyseButton();

function tryAddAnalyseButton() {
  if (!addAnalyseButton()) {
    setTimeout(tryAddAnalyseButton, 100)
  }
}

function addAnalyseButton() {
  const container = document.querySelector('ytd-video-secondary-info-renderer #container #top-row')
  if (!container) return false;
  const subscribeButton = document.querySelector('ytd-video-secondary-info-renderer #container #top-row #subscribe-button')
  analyseButton = document.createElement('button')
  analyseButton.innerText = "Analyse"
  analyseButton.classList.add('ytsa-btn-analyse');

  container.insertBefore(analyseButton, subscribeButton)

  analyseButton.addEventListener('click', analyseVideo)
  detectUrlChange()
  return true;
}

function analyseVideo() {
  const params = new URL(location.href).searchParams;
  const videoId = params.get('v');

  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.classList.add('ytsa-iframe')
    const container = document.querySelector('ytd-video-secondary-info-renderer');
    container.appendChild(iframe)
  }

  iframe.src = chrome.runtime.getURL(`www/index.html?videoId=${videoId}`);
}

function closeIFrame() {
  if (iframe) {
    iframe.remove();
    iframe = null;
  }
}

function detectUrlChange() {
  let previousUrl = '';
  const observer = new MutationObserver(function(mutations) {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      closeIFrame()
    }
  });

  observer.observe(
    document.querySelector('ytd-video-secondary-info-renderer #description yt-formatted-string'),
    {
      childList: true,
      subtree: false
    });
}


