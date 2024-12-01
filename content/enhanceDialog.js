// Handles the enhancement dialog UI
const enhanceDialog = {
  createDialog(contentType, currentContent, onEnhance) {
    // Remove any existing dialogs
    const existingDialog = document.querySelector('.enhance-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = domUtils.createElement('div', 'enhance-dialog');
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Enhance ${contentType}</h3>
        ${contentType === 'Description' ? `
          <div class="keep-existing-checkbox">
            <input type="checkbox" id="keepExisting" checked>
            <label for="keepExisting">Keep existing content and append new content</label>
          </div>
        ` : ''}
        <textarea class="prompt-input" placeholder="Enter your enhancement instructions...">${currentContent || ''}</textarea>
        <div class="dialog-buttons">
          <button class="cancel-button">Cancel</button>
          <button class="enhance-button">Enhance</button>
        </div>
      </div>
    `;

    const promptInput = dialog.querySelector('.prompt-input');
    const enhanceButton = dialog.querySelector('.enhance-button');
    const cancelButton = dialog.querySelector('.cancel-button');
    const keepExisting = dialog.querySelector('#keepExisting');

    const closeDialog = () => dialog.remove();

    enhanceButton.addEventListener('click', () => {
      const userPrompt = promptInput.value.trim();
      if (!userPrompt) {
        toastManager.show('Please enter enhancement instructions', 'error');
        return;
      }
      onEnhance(userPrompt, keepExisting?.checked);
      closeDialog();
    });

    cancelButton.addEventListener('click', closeDialog);

    // Close on background click
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });

    document.body.appendChild(dialog);
    promptInput.focus();
  }
};

window.enhanceDialog = enhanceDialog;