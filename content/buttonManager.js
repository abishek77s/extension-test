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

  createButtonGroup(...buttons) {
    const group = domUtils.createElement('div', 'button-group');
    buttons.forEach(button => group.appendChild(button));
    return group;
  },

  injectButtons(container, buttonGroup) {
    container.appendChild(buttonGroup);
  }
};

window.buttonManager = buttonManager;