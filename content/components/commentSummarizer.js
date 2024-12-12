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
      await this.handleSummarization(button);
    });
    
    return button;
  },

  async handleSummarization(button) {
    try {
      uiControls.setButtonLoading(button, true);
      
      const videoId = window.navigationUtils.extractVideoIdFromUrl();
      if (!videoId) {
        toastManager.show('Could not find video ID', 'error');
        return;
      }

      const comments = await window.commentUtils.fetchComments(videoId);
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

    const button = this.createSummarizeButton();
    filterBar.appendChild(button);
  }
};

window.commentSummarizer = commentSummarizer;