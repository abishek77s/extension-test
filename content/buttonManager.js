// Manages button creation and organization
const buttonManager = {
  createGenerateButton(text, contentType) {
    const button = domUtils.createElement('a', 'gen-button');
    button.innerHTML = `
       <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 54 48">
      <path fill="#fff" d="M51.955 5.77 48.76 2.575a5.86 5.86 0 0 0-8.278 0L8.518 34.537c-.205.205-.335.47-.377.752L6.543 46.477c-.058.415.082.835.377 1.133a1.324 1.324 0 0 0 1.133.377l10.978-1.57c.012 0 .022 0 .035-.002.005 0 .01-.005.015-.005l.157-.023c.285-.04.55-.172.753-.377l31.964-31.964a5.86 5.86 0 0 0 0-8.279v.003Zm-39.6 28.697L36.89 9.935l7.702 7.703-24.921 24.92a13.431 13.431 0 0 0-7.316-8.091Zm-1.72 2.202a10.704 10.704 0 0 1 6.666 7.303l-7.868 1.125 1.203-8.425v-.003ZM50.07 12.163l-3.59 3.59-7.703-7.703 3.59-3.59a3.192 3.192 0 0 1 4.508 0l3.195 3.195a3.191 3.191 0 0 1 0 4.508ZM1.31 21.951c3.99 1.103 4.636 1.745 5.738 5.736a1.333 1.333 0 0 0 2.57 0c1.103-3.99 1.748-4.636 5.738-5.736a1.333 1.333 0 0 0 0-2.57c-3.99-1.102-4.635-1.745-5.738-5.735a1.333 1.333 0 0 0-2.57 0c-1.102 3.99-1.747 4.635-5.737 5.735a1.333 1.333 0 0 0 0 2.57Zm7.024-4.102c.682 1.277 1.537 2.135 2.815 2.817-1.278.683-2.135 1.538-2.815 2.818-.683-1.278-1.538-2.135-2.816-2.818 1.278-.682 2.136-1.537 2.816-2.817ZM20.69 7.283a1.333 1.333 0 0 0 0-2.57C18.037 3.98 17.687 3.63 16.954.978a1.333 1.333 0 0 0-2.57 0c-.732 2.652-1.082 3.002-3.737 3.735a1.333 1.333 0 0 0 0 2.57c2.655.732 3.005 1.082 3.737 3.735a1.333 1.333 0 0 0 2.57 0c.733-2.653 1.083-3.003 3.738-3.735ZM15.669 7.2a4.662 4.662 0 0 0-1.202-1.202 4.66 4.66 0 0 0 1.202-1.203c.333.48.723.87 1.203 1.203A4.66 4.66 0 0 0 15.669 7.2Z"/>
    </svg>
    `;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      messageHandler.handleGeneration(button, contentType);
    });
    return button;
  },

  createEnhanceButton(text, contentType) {
    const button = domUtils.createElement('a', 'prompt-button');
    button.innerHTML = `
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 77 66">
          <path fill="url(#a)" d="M7.699 55.82h13.293l8.4 9.012c.364.39.873.614 1.407.614s1.043-.22 1.408-.614l8.399-9.012H53.9c4.248 0 7.698-3.455 7.698-7.7V34.26a1.923 1.923 0 1 0-3.847 0v13.86a3.855 3.855 0 0 1-3.851 3.852H39.769c-.535 0-1.044.22-1.408.614L30.799 60.7l-7.562-8.114a1.928 1.928 0 0 0-1.407-.614H7.699a3.855 3.855 0 0 1-3.851-3.851v-30.8a3.855 3.855 0 0 1 3.85-3.85H44.66a1.923 1.923 0 1 0 0-3.848L7.7 9.619C3.45 9.62 0 13.073 0 17.318v30.8c0 4.247 3.454 7.698 7.699 7.698v.004Z"/>
          <path fill="url(#b)" d="M12.112 37.932c.375.376.87.563 1.36.563.495 0 .986-.187 1.361-.563l3.851-3.851a1.92 1.92 0 0 0 0-2.722l-3.85-3.85a1.92 1.92 0 0 0-2.722 0 1.92 1.92 0 0 0 0 2.72l2.49 2.491-2.49 2.49a1.92 1.92 0 0 0 0 2.722Z"/>
          <path fill="url(#c)" d="M13.474 46.197h25.024a1.923 1.923 0 1 0 0-3.847H13.474a1.923 1.923 0 1 0 0 3.847Z"/>
          <path fill="url(#d)" d="M75.588 12.579c-7.691-2.126-9.048-3.48-11.171-11.168A1.921 1.921 0 0 0 62.562 0c-.866 0-1.628.578-1.855 1.411-2.123 7.688-3.48 9.046-11.172 11.168a1.924 1.924 0 0 0 0 3.71c7.692 2.126 9.05 3.48 11.172 11.168a1.921 1.921 0 0 0 1.855 1.411 1.92 1.92 0 0 0 1.855-1.411c2.122-7.688 3.48-9.045 11.171-11.168a1.924 1.924 0 0 0 0-3.71ZM62.562 21.01c-1.466-3.244-3.332-5.107-6.577-6.576 3.245-1.465 5.111-3.331 6.577-6.576 1.465 3.245 3.331 5.107 6.576 6.576-3.245 1.466-5.11 3.332-6.576 6.577Z"/>
          <defs>
            <linearGradient id="a" x1="30.799" x2="30.799" y1="9.619" y2="65.446" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FE0235"/>
              <stop offset="1" stop-color="#E13581"/>
            </linearGradient>
            <linearGradient id="b" x1="15.398" x2="15.398" y1="26.942" y2="38.495" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FE0235"/>
              <stop offset="1" stop-color="#E13581"/>
            </linearGradient>
            <linearGradient id="c" x1="25.986" x2="25.986" y1="42.35" y2="46.197" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FE0235"/>
              <stop offset="1" stop-color="#E13581"/>
            </linearGradient>
            <linearGradient id="d" x1="62.562" x2="62.562" y1="0" y2="28.868" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FE0235"/>
              <stop offset="1" stop-color="#E13581"/>
            </linearGradient>
          </defs>
        </svg>
    `;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      messageHandler.handleEnhancement(button, contentType);
    });
    return button;
  },

  createRegenerateButton(text, contentType) {
    const button = domUtils.createElement('a', 'regen-button');
    button.innerHTML = `
          
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="54" height="60" fill="none" viewBox="0 0 54 60">
      <path fill="#fff" d="m27.267 19.334 1 2.777a11.004 11.004 0 0 0 6.621 6.62l2.777 1.001a.284.284 0 0 1 0 .535l-2.777 1a11.004 11.004 0 0 0-6.62 6.621l-1 2.777a.284.284 0 0 1-.536 0l-1-2.777a11.004 11.004 0 0 0-6.621-6.62l-2.777-1a.284.284 0 0 1 0-.536l2.777-1a11.004 11.004 0 0 0 6.62-6.621l1.001-2.777a.284.284 0 0 1 .535 0Z"/>
      <path class='circle ' fill="#fff" d="M49.694 16.328a1.997 1.997 0 0 0-2.735-.671 1.993 1.993 0 0 0-.672 2.734 22.379 22.379 0 0 1 3.23 11.61c0 12.415-10.102 22.518-22.518 22.518a22.44 22.44 0 0 1-6.205-.886l1.975-.95a1.99 1.99 0 1 0-1.726-3.589l-6.22 2.991a1.999 1.999 0 0 0-1.038 1.204c-.162.53-.097 1.1.176 1.58l3.439 5.987a1.988 1.988 0 0 0 2.72.736 1.989 1.989 0 0 0 .733-2.717l-.756-1.319c2.234.605 4.543.941 6.905.941 14.612 0 26.498-11.888 26.498-26.499a26.39 26.39 0 0 0-3.806-13.67ZM26.996 7.48c2.128 0 4.205.311 6.206.886l-1.976.95a1.99 1.99 0 1 0 1.727 3.588l6.22-2.99a2 2 0 0 0 1.038-1.205c.164-.527.102-1.1-.175-1.58l-3.438-5.986A1.989 1.989 0 0 0 33.88.409a1.989 1.989 0 0 0-.734 2.717l.756 1.319A26.382 26.382 0 0 0 27 3.504C12.386 3.504.5 15.392.5 30.003c0 4.834 1.316 9.564 3.807 13.672a1.99 1.99 0 0 0 2.734.67c.94-.57 1.24-1.795.672-2.735A22.38 22.38 0 0 1 4.483 30c-.002-12.418 10.1-22.52 22.513-22.52Z"/>
    </svg>
    
    `;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      messageHandler.handleRegeneration(button, contentType);
    });
    return button;
  },

  createButtonGroup(...buttons) {
    const container = domUtils.createElement('div', 'button-container');
    const toolbar = domUtils.createElement('div', 'toolbar');
    buttons.forEach(button => toolbar.appendChild(button));
    container.appendChild(toolbar);
    return container;
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