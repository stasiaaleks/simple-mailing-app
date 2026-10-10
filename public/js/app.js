// Main application initialization

document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await Promise.all([loadContacts(), loadTemplates()]);
});
