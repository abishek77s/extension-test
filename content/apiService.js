// Handles all API communication
const apiService = {
  async generateContent(videoLink, choice) {
    const response = await chrome.runtime.sendMessage({
      type: 'GENERATE_CONTENT',
      data: { prompt: videoLink, choice },
    });
    return response;
  },

  async enhanceContent(text, contentType, userPrompt) {
    const response = await chrome.runtime.sendMessage({
      type: 'ENHANCE_CONTENT',
      data: { text, contentType, userPrompt },
    });
    return response;
  }
};

window.apiService = apiService;