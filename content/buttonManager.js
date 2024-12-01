// Manages button creation and organization
const buttonManager = {
  createGenerateButton(text, contentType) {
    const button = uiControls.createButton(`Generate ${text}`, function() {
      messageHandler.handleGeneration(this, contentType);
    });
    return button;
  },

  createEnhanceButton(text, contentType) {
    const button = uiControls.createButton(`Enhance ${text}`, function() {
      messageHandler.handleEnhancement(this, contentType);
    });
    return button;
  },

  createRegenerateButton(text, contentType) {
    const button = uiControls.createButton(`Regenerate ${text}`, function() {
      messageHandler.handleRegeneration(this, contentType);
    });
    button.classList.add('regenerate-button');
    return button;
  },

  createButtonGroup(...buttons) {
    const group = domUtils.createElement('div', 'button-group');
    buttons.forEach(button => group.appendChild(button));
    return group;
  },

  injectButtons(container, buttonGroup) {
    container.appendChild(buttonGroup);
  },

  replaceWithRegenerateButton(originalButton, text, contentType) {
    const regenerateButton = this.createRegenerateButton(text, contentType);
    originalButton.parentNode.replaceChild(regenerateButton, originalButton);
    return regenerateButton;
  }
};

window.buttonManager = buttonManager;