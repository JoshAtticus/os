var urlInput = document.getElementById('url-input');
var goButton = document.getElementById('go-button');
var backButton = document.getElementById('back-button');
var forwardButton = document.getElementById('forward-button');
var refreshButton = document.getElementById('refresh-button');
var faviconContainer = document.getElementById('favicon-container');
var faviconImage = document.getElementById('favicon');
var iframe = document.getElementById('page-iframe');
var banner = document.getElementById('banner');
var corsErrorMessage = document.getElementById('cors-error-message');

var bannerMessages = {
    'https://app.revolt.chat': 'Revolt does not work in this browser due to CORS. You can either host your own client or use a standard browser tab.',
    'https://google.com': 'Google does not work in this browser due to CORS. You can use Bing, however clicking on any links will open in a normal browser tab.',
    'https://discord.com': 'Discord does not work in this browser due to CORS.',
    'https://open.spotify.com': 'Spotify does not work in this browser due to CORS.',
    'https://youtube.com': 'YouTube does not work in this browser due to CORS.',
    'https://github.com': 'GitHub does not work in this browser due to CORS.',
    'https://twitter.com': 'Twitter does not work in this browser due to CORS.',
    'https://reddit.com': 'Reddit does not work in this browser due to CORS. Use https://www.troddit.com instead.'

};

goButton.addEventListener('click', function () {
    var url = urlInput.value;
    navigateTo(url);
});

urlInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        var url = urlInput.value;
        navigateTo(url);
    }
});

backButton.addEventListener('click', function () {
    iframe.contentWindow.history.back();
});

forwardButton.addEventListener('click', function () {
    iframe.contentWindow.history.forward();
});

refreshButton.addEventListener('click', function () {
    iframe.src = iframe.src;
});

window.addEventListener('message', function (event) {
    if (event.data.type === 'urlChange') {
        urlInput.value = event.data.url;
    }
});


window.addEventListener('DOMContentLoaded', function() {
    var iframe = document.getElementById('page-iframe');
    iframe.src = 'newtab/index.html';
  });

  window.addEventListener('DOMContentLoaded', function() {
    var iframe = document.getElementById('page-iframe');
    var homeButton = document.getElementById('home-button');
    
    iframe.src = 'newtab/index.html';
    
    homeButton.addEventListener('click', function() {
      iframe.src = 'newtab/index.html';
    });
  });
  
  

function navigateTo(url) {
    if (isBlockedSite(url)) {
        showBanner(url);
    } else {
        hideBanner();
        iframe.src = url;
        var faviconUrl = getFaviconUrl(url);
        setFavicon(faviconUrl);
    }
}

function getFaviconUrl(url) {
    var match = url.match(/^(https?:\/\/[^\/?#]+)(?:[\/?#]|$)/i);
    var baseUrl = match && match[1];
    return baseUrl + '/favicon.ico';
}

function setFavicon(url) {
    if (url) {
        faviconImage.src = url;
        faviconContainer.style.display = 'inline-block';
    } else {
        faviconContainer.style.display = 'none';
    }
}

function isBlockedSite(url) {
    return bannerMessages.hasOwnProperty(url);
}

function showBanner(url) {
    banner.textContent = bannerMessages[url];
    banner.style.display = 'block';
}

function hideBanner() {
    banner.style.display = 'none';
}

iframe.addEventListener('load', function () {
    var currentUrl = iframe.contentWindow.location.href;
    window.postMessage({ type: 'urlChange', url: currentUrl }, '*');

    if (isCorsError()) {
        showCorsErrorMessage();
    } else {
        hideCorsErrorMessage();
    }
});

function isCorsError() {
    return iframe.contentWindow.location.href === 'about:blank';
}

function showCorsErrorMessage() {
    corsErrorMessage.style.display = 'block';
}

function hideCorsErrorMessage() {
    corsErrorMessage.style.display = 'none';
}
