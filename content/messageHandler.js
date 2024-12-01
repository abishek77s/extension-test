async function handleGeneration(button, contentType) {
  try {
    if (!button) {
      toastManager.show('Internal error: Button not found', 'error');
      return;
    }

    uiControls.setButtonLoading(button, true);

    const videoLink = domUtils.getVideoLink();
    if (!videoLink) {
      toastManager.show('Could not find video link', 'error');
      return;
    }

    const choice = { title: 1, description: 2, tags: 3 }[contentType.toLowerCase()] || 1;
    const response = await apiService.generateContent(videoLink, choice);

    if (response.success) {
      let updateSuccess = false;
      
      switch(contentType.toLowerCase()) {
        case 'title':
          updateSuccess = await responseHandler.updateTitleField(response.data);
          break;
        case 'description':
          updateSuccess = await responseHandler.updateDescriptionField(response.data);
          break;
        case 'tags':
          updateSuccess = await responseHandler.updateTagsField(response.data);
          break;
      }

      if (updateSuccess) {
        toastManager.show(`${contentType} generated successfully!`, 'success');
      } else {
        toastManager.show(`Error: Could not find ${contentType} input field`, 'error');
      }
    } else {
      toastManager.show(`Error generating ${contentType}`, 'error');
    }
  } catch (error) {
    console.error('Generation error:', error);
    toastManager.show(`Unexpected error generating ${contentType}`, 'error');
  } finally {
    if (button) {
      uiControls.setButtonLoading(button, false);
    }
  }
}

async function handleEnhancement(button, contentType) {
  try {
    if (!button) {
      toastManager.show('Internal error: Button not found', 'error');
      return;
    }

    const inputSelector = contentType === 'Title'
      ? domUtils.SELECTORS.TITLE_INPUT
      : domUtils.SELECTORS.DESCRIPTION_INPUT;
    const inputElement = domUtils.querySelector(inputSelector);
    
    if (!inputElement) {
      toastManager.show(`Error: Could not find ${contentType} input field`, 'error');
      return;
    }

    const currentContent = inputElement.textContent || '';
    
    enhanceDialog.createDialog(contentType, currentContent, async (userPrompt, keepExisting) => {
      try {
        uiControls.setButtonLoading(button, true);
        
        const response = await apiService.enhanceContent(currentContent, contentType.toLowerCase(), userPrompt);
        
        if (response.success) {
          const updateSuccess = contentType === 'Title'
            ? await responseHandler.updateTitleField(response.data)
            : await responseHandler.updateDescriptionField(response.data, keepExisting);

          if (updateSuccess) {
            toastManager.show(`${contentType} enhanced successfully!`, 'success');
          } else {
            toastManager.show(`Error: Could not find ${contentType} input field`, 'error');
          }
        } else {
          toastManager.show(`Error enhancing ${contentType}`, 'error');
        }
      } catch (error) {
        console.error('Enhancement error:', error);
        toastManager.show(`Unexpected error enhancing ${contentType}`, 'error');
      } finally {
        uiControls.setButtonLoading(button, false);
      }
    });
  } catch (error) {
    console.error('Enhancement dialog error:', error);
    toastManager.show(`Unexpected error enhancing ${contentType}`, 'error');
  }
}

window.messageHandler = { handleGeneration, handleEnhancement };