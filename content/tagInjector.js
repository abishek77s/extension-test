// Responsible for handling tag-related DOM operations
const tagInjector = {
  isTagsInjected: false,

  injectTagsButton() {
    const tagsInput = domUtils.querySelector(domUtils.SELECTORS.TAGS_INPUT);
    
    if (tagsInput && !this.isTagsInjected) {
      console.log('Injecting tags button...');
      
      const tagsContainer = uiControls.createButtonContainer();
      const tagsButton = uiControls.createButton('Generate Tags', () => 
        messageHandler.handleGeneration(tagsButton, 'Tags')
      );

      tagsContainer.appendChild(tagsButton);
      tagsInput.parentElement.insertBefore(tagsContainer, tagsInput);
      
      this.isTagsInjected = true;
      console.log('Tags button injected successfully');
    }
  },

  setupShowMoreObserver() {
    // Watch for button clicks
    document.addEventListener('click', (event) => {
      const showMoreButton = event.target.closest(domUtils.SELECTORS.SHOW_MORE_BUTTON);
      const showLessButton = event.target.closest(domUtils.SELECTORS.SHOW_LESS_BUTTON);
      
      if (showMoreButton || showLessButton) {
        console.log('Show more/less button clicked');
        // Use setTimeout to wait for the DOM to update
        setTimeout(() => {
          this.injectTagsButton();
        }, 500);
      }
    });

    // Also set up a mutation observer as a fallback
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const tagsInput = domUtils.querySelector(domUtils.SELECTORS.TAGS_INPUT);
          if (tagsInput && !this.isTagsInjected) {
            console.log('Tags input detected through mutation observer');
            this.injectTagsButton();
            break;
          }
        }
      }
    });

    // Start observing the metadata editor section
    const metadataEditor = domUtils.querySelector('.ytcp-video-metadata-editor');
    if (metadataEditor) {
      observer.observe(metadataEditor, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
  }
};

window.tagInjector = tagInjector;