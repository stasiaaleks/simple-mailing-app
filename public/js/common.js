const toast = document.querySelector('#toast');
const toastTitle = document.querySelector('#toast-title');
const toastMessage = document.querySelector('#toast-message');

const TOAST_CLASSES = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info'
};

function showToast(title, message, type = TOAST_TYPES.INFO) {
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.className = `toast ${TOAST_CLASSES[type]}`;
  new bootstrap.Toast(toast).show();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
