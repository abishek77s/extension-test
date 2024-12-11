// Main entry point
function injectControls() {
  const titleInput = domUtils.querySelector(domUtils.SELECTORS.TITLE_INPUT);
  const descriptionInput = domUtils.querySelector(domUtils.SELECTORS.DESCRIPTION_INPUT);

  if (titleInput && descriptionInput) {
    // Create title buttons
    const titleContainer = uiControls.createButtonContainer();
    const titleGenerate = buttonManager.createGenerateButton('Title', 'Title');
    const titleEnhance = buttonManager.createEnhanceButton('Title', 'Title');
    const titleGroup = buttonManager.createButtonGroup(titleGenerate, titleEnhance);
    buttonManager.injectButtons(titleContainer, titleGroup);

    // Create description buttons
    const descContainer = uiControls.createButtonContainer();
    const descGenerate = buttonManager.createGenerateButton('Description', 'Description');
    const descEnhance = buttonManager.createEnhanceButton('Description', 'Description');
    const descGroup = buttonManager.createButtonGroup(descGenerate, descEnhance);
    buttonManager.injectButtons(descContainer, descGroup);
    
    // Insert containers
    titleInput.parentElement.insertBefore(titleContainer, titleInput);
    descriptionInput.parentElement.insertBefore(descContainer, descriptionInput);

    // Inject CC status bar
    window.ccStatusBar.injectStatusBar();
  }

  // Check if we're on the comments page and inject the summarize button
  if (window.location.href.includes('/comments/')) {
    window.commentSummarizer.injectSummarizeButton();
  }
}

function handleNavigation() {
  // Clear any existing observers
  if (window.currentObserver) {
    window.currentObserver.disconnect();
  }

  const observer = new MutationObserver((mutations, obs) => {
    const shouldInject = domUtils.querySelector(domUtils.SELECTORS.TITLE_INPUT) || 
                        window.location.href.includes('/comments/');
    
    if (shouldInject) {
      console.log('Injecting controls...');
      injectControls();
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.currentObserver = observer;
}

function initialize() {
  console.log('Initializing YouTube Studio Enhancer...');
  
  // Clear expired cache on initialization
  window.cacheUtils.clearExpiredCache();
  
  // Initial injection
  handleNavigation();

  // Setup navigation observer
  window.navigationUtils.setupNavigationObserver(() => {
    console.log('URL changed, reinitializing controls...');
    handleNavigation();
  });
}

initialize();

console.log('YouTube Studio Enhancer content script loaded.');