// Main comment summarizer component
const commentSummarizer = {
  async handleSummarization(button) {
    try {
      if (!button) {
        toastManager.show('Internal error: Button not found', 'error');
        return;
      }

      uiControls.setButtonLoading(button, true);
      
      const videoId = window.navigationUtils.extractVideoIdFromUrl();
      if (!videoId) {
        toastManager.show('Could not find video ID', 'error');
        return;
      }

      const comments = await window.commentUtils.fetchComments(videoId);
      if (!comments || !comments.length) {
        toastManager.show('No comments found', 'error');
        return;
      }

      const summaryBox = window.commentSummarizerUiComponents.createOrGetSummaryBox();
      summaryBox.style.display = 'block';
      
      const contentElement = summaryBox.querySelector('.summary-content');
      window.commentSummarizerAnimationUtils.showLoadingAnimation(contentElement);

      const response = await chrome.runtime.sendMessage({
        type: 'SUMMARIZE_COMMENTS',
        data: { comments }
      });

      if (response && response.success && response.data) {
        await window.commentSummarizerAnimationUtils.animateText(contentElement, response.data);
        toastManager.show('Comments summarized successfully!', 'success');
      } else {
        contentElement.innerHTML = 'Error summarizing comments';
        toastManager.show('Error summarizing comments', 'error');
      }
    } catch (error) {
      console.error('Error handling summarization:', error);
      toastManager.show('Unexpected error summarizing comments', 'error');
    } finally {
      uiControls.setButtonLoading(button, false);
    }
  },

  injectSummarizeButton() {
    const filterBar = domUtils.querySelector('ytcp-filter-bar');
    if (!filterBar) return;

    const existingButton = filterBar.querySelector('.summarize-button');
    if (existingButton) {
      existingButton.remove();
    }

    const button = window.commentSummarizerUiComponents.createSummarizeButton();
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.handleSummarization(button);
    });
    
    filterBar.appendChild(button);
  }
};

window.commentSummarizer = commentSummarizer;