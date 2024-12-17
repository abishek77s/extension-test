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

      // Create or get the summary box before making the request
      const summaryBox = this.createOrGetSummaryBox();
      summaryBox.style.display = 'block';
      this.showLoadingAnimation(summaryBox);

      const response = await chrome.runtime.sendMessage({
        type: 'SUMMARIZE_COMMENTS',
        data: { comments }
      });

      if (response.success) {
        this.animateText(summaryBox, response.data);
        toastManager.show('Comments summarized successfully!', 'success');
      } else {
        summaryBox.querySelector('.summary-content').innerHTML = 'Error summarizing comments';
        toastManager.show('Error summarizing comments', 'error');
      }
    } catch (error) {
      console.error('Error handling summarization:', error);
      toastManager.show('Unexpected error summarizing comments', 'error');
    } finally {
      uiControls.setButtonLoading(button, false);
    }
  },

  createOrGetSummaryBox() {
    let summaryBox = document.querySelector('.summary-box');
    
    if (!summaryBox) {
      summaryBox = domUtils.createElement('div', 'summary-box');
      summaryBox.innerHTML = `
        <div class="summary-header">
          <h3>Comment Summary</h3>
          <button class="close-summary">×</button>
        </div>
        <div class="summary-content"></div>
      `;

      const closeButton = summaryBox.querySelector('.close-summary');
      closeButton.addEventListener('click', () => {
        summaryBox.style.display = 'none';
      });

      // Insert after the filter bar
      const filterBar = domUtils.querySelector('ytcp-filter-bar');
      filterBar.parentNode.insertBefore(summaryBox, filterBar.nextSibling);
    }

    return summaryBox;
  },

  showLoadingAnimation(summaryBox) {
    const content = summaryBox.querySelector('.summary-content');
    content.innerHTML = '<div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>';
  },

  async animateText(summaryBox, text) {
    const content = summaryBox.querySelector('.summary-content');
    content.innerHTML = '';
    
    const words = text.split(' ');
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex < words.length) {
        content.innerHTML += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
        currentIndex++;
        requestAnimationFrame(() => {
          content.scrollTop = content.scrollHeight;
          setTimeout(animate, 50); // Adjust speed as needed
        });
      }
    };

    animate();
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