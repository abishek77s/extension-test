// Comment summarizer component
const commentSummarizer = {
  createSummarizeButton() {
    const button = domUtils.createElement('a', 'summarize-button');
    button.innerHTML = `
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
      </svg>
      <span>Summarize Comments</span>
    `;
    
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      this.showDurationDialog(button);
    });
    
    return button;
  },

  createScrollerButton() {
    const button = domUtils.createElement('a', 'scroller-button');
    button.innerHTML = `
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"/>
      </svg>
      <span>Load Comments</span>
    `;
    
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      this.showDurationDialog(button);
    });
    
    return button;
  },

  showDurationDialog(button) {
    const dialog = domUtils.createElement('div', 'duration-dialog');
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Select Comments Duration</h3>
        <div class="duration-options">
          <button data-duration="30">30 seconds</button>
          <button data-duration="60">1 minute</button>
          <button data-duration="120">2 minutes</button>
          <button data-duration="300">5 minutes</button>
        </div>
        <div class="dialog-buttons">
          <button class="cancel-button">Cancel</button>
        </div>
      </div>
    `;

    const handleDurationSelect = async (duration) => {
      dialog.remove();
      if (button.classList.contains('scroller-button')) {
        await this.scrollComments(duration, button);
      } else {
        await this.handleSummarization(button, duration);
      }
    };

    dialog.querySelectorAll('.duration-options button').forEach(btn => {
      btn.addEventListener('click', () => handleDurationSelect(parseInt(btn.dataset.duration)));
    });

    dialog.querySelector('.cancel-button').addEventListener('click', () => dialog.remove());
    document.body.appendChild(dialog);
  },

  async scrollComments(duration, button) {
    try {
      uiControls.setButtonLoading(button, true);
      
      const scrollableContainer = document.querySelector('ytcp-comments-section');
      if (!scrollableContainer) {
        toastManager.show('Comments section not found', 'error');
        return;
      }

      const startTime = Date.now();
      const endTime = startTime + (duration * 1000);
      
      while (Date.now() < endTime) {
        const previousScrollHeight = scrollableContainer.scrollHeight;
        scrollableContainer.scrollBy(0, 1000);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (scrollableContainer.scrollHeight === previousScrollHeight) {
          break;
        }
      }

      toastManager.show('Comments loaded successfully!', 'success');
    } catch (error) {
      console.error('Error scrolling comments:', error);
      toastManager.show('Error loading comments', 'error');
    } finally {
      uiControls.setButtonLoading(button, false);
    }
  },

  async scrapeComments() {
    const scrollableContainer = document.querySelector('ytcp-comments-section');
    if (!scrollableContainer) {
      throw new Error('Comments section not found');
    }

    const comments = new Set();
    scrollableContainer.querySelectorAll('yt-formatted-string#content-text').forEach(commentElement => {
      if (comments.size < 100) {
        comments.add(commentElement.textContent.trim());
      }
    });

    return [...comments];
  },

  async handleSummarization(button, duration) {
    try {
      uiControls.setButtonLoading(button, true);
      
      const comments = await this.scrapeComments();
      if (!comments.length) {
        toastManager.show('No comments found', 'error');
        return;
      }

      const response = await chrome.runtime.sendMessage({
        type: 'SUMMARIZE_COMMENTS',
        data: { comments }
      });

      if (response.success) {
        this.showSummaryDialog(response.data);
        toastManager.show('Comments summarized successfully!', 'success');
      } else {
        toastManager.show('Error summarizing comments', 'error');
      }
    } catch (error) {
      console.error('Error handling summarization:', error);
      toastManager.show('Unexpected error summarizing comments', 'error');
    } finally {
      uiControls.setButtonLoading(button, false);
    }
  },

  showSummaryDialog(summary) {
    const dialog = domUtils.createElement('div', 'summary-dialog');
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Comment Summary</h3>
        <div class="summary-content">${summary}</div>
        <div class="dialog-buttons">
          <button class="close-button">Close</button>
        </div>
      </div>
    `;

    const closeButton = dialog.querySelector('.close-button');
    closeButton.addEventListener('click', () => dialog.remove());

    document.body.appendChild(dialog);
  },

  injectSummarizeButton() {
    const filterBar = domUtils.querySelector('ytcp-filter-bar');
    if (!filterBar) return;

    const existingButton = filterBar.querySelector('.summarize-button');
    if (existingButton) {
      existingButton.remove();
    }

    const existingScrollerButton = filterBar.querySelector('.scroller-button');
    if (existingScrollerButton) {
      existingScrollerButton.remove();
    }

    const buttonContainer = domUtils.createElement('div', 'comment-buttons-container');
    const scrollerButton = this.createScrollerButton();
    const summarizeButton = this.createSummarizeButton();
    
    buttonContainer.appendChild(scrollerButton);
    buttonContainer.appendChild(summarizeButton);
    filterBar.appendChild(buttonContainer);
  }
};

window.commentSummarizer = commentSummarizer;