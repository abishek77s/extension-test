// Handles server responses and input field updates
const responseHandler = {
  async updateTitleField(content) {
    const titleInput = domUtils.querySelector(domUtils.SELECTORS.TITLE_INPUT);
    if (titleInput) {
      titleInput.textContent = content;
      this.triggerInputEvents(titleInput);
      return true;
    }
    return false;
  },

  async updateDescriptionField(content, keepExisting = false) {
    const descInput = domUtils.querySelector(domUtils.SELECTORS.DESCRIPTION_INPUT);
    if (descInput) {
      if (keepExisting) {
        const existingContent = descInput.textContent;
        descInput.textContent = existingContent + '\n\n' + content;
      } else {
        descInput.textContent = content;
      }
      this.triggerInputEvents(descInput);
      return true;
    }
    return false;
  },

  async updateTagsField(tags) {
    const tagsInput = domUtils.querySelector(domUtils.SELECTORS.TAGS_INPUT);
    if (tagsInput) {
      const tagList = tags.split(',').map(tag => tag.trim());
      for (const tag of tagList) {
        tagsInput.value = tag;
        this.triggerInputEvents(tagsInput);
        tagsInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }
      return true;
    }
    return false;
  },

  triggerInputEvents(element) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

window.responseHandler = responseHandler;