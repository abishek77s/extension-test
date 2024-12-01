// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Studio Enhancer extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background script:', request);

  if (request.type === 'GENERATE_CONTENT') {
    console.log('Processing content generation request:', request.data);
    handleContentGeneration(request.data)
      .then(response => {
        console.log('Content generation response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Content generation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }

  if (request.type === 'ENHANCE_CONTENT') {
    console.log('Processing content enhancement request:', request.data);
    handleContentEnhancement(request.data)
      .then(response => {
        console.log('Content enhancement response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Content enhancement error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});

async function handleContentGeneration({ prompt, choice }) {
  console.log('Handling content generation:', { prompt, choice });

  try {
    const response = await fetch('http://127.0.0.1:8080/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: prompt, choice })
    });

    console.log('Fetch response:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Processed content data:', data);
      return data.result;
    } else {
      const errorText = await response.text();
      console.error('Error generating content:', errorText);
      throw new Error(`Error generating content: ${errorText}`);
    }
  } catch (error) {
    console.error('Catch block - Error generating content:', error);
    throw error;
  }
}

async function handleContentEnhancement({ text, contentType, userPrompt }) {
  console.log('Handling content enhancement:', { text, contentType, userPrompt });

  try {
    const response = await fetch('http://127.0.0.1:8080/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, contentType, user_prompt: userPrompt })
    });

    console.log('Fetch response:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Enhanced content data:', data);
      return data.result;
    } else {
      const errorText = await response.text();
      console.error('Error enhancing content:', errorText);
      throw new Error(`Error enhancing content: ${errorText}`);
    }
  } catch (error) {
    console.error('Catch block - Error enhancing content:', error);
    throw error;
  }
}

console.log('YouTube Studio Enhancer background script loaded.');