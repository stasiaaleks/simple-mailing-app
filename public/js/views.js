// UI Views and Rendering

// Page elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav .nav-link');
const contactsTable = document.querySelector('#contacts-table');
const contactsList = document.querySelector('#contacts-list');
const selectAllCheckbox = document.querySelector('#select-all');
const sortHeaders = document.querySelectorAll('th[data-sort]');
const selectedCount = document.querySelector('#selected-count');
const emailForm = document.querySelector('#email-form');
const addForm = document.querySelector('#add-contact-form');
const editForm = document.querySelector('#edit-contact-form');
const editModal = document.querySelector('#edit-modal');
const toast = document.querySelector('#toast');
const toastTitle = document.querySelector('#toast-title');
const toastMessage = document.querySelector('#toast-message');

// State
let allContacts = [];
let allTemplates = [];
let selectedContacts = new Set();
let currentSort = { field: 'surname', direction: 'asc' };

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

function updateSelectedCount() {
  selectedCount.textContent = selectedContacts.size;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render contacts table
function renderContactsTable(contacts) {
  if (contacts.length === 0) {
    contactsTable.innerHTML = '<tr><td colspan="5" class="text-center">No contacts found</td></tr>';
    return;
  }

  contactsTable.innerHTML = contacts.map(contact => `
    <tr>
      <td>
        <input type="checkbox" class="contact-checkbox" value="${contact._id}"
               ${selectedContacts.has(contact._id) ? 'checked' : ''}>
      </td>
      <td>${escapeHtml(contact.surname)}</td>
      <td>${escapeHtml(contact.firstName)}</td>
      <td>${escapeHtml(contact.patronymic)}</td>
      <td>${escapeHtml(contact.email)}</td>
    </tr>
  `).join('');
}

// Render templates dropdown
function renderTemplates(templates) {
  emailForm.elements.template.innerHTML = '<option value="">Select a template...</option>' +
    templates.map(t => `<option value="${t.key}">${escapeHtml(t.subject)}</option>`).join('');
}

// Render contacts list in manage page
function renderContactsList(contacts) {
  if (contacts.length === 0) {
    contactsList.innerHTML = '<tr><td colspan="3" class="text-muted">No contacts</td></tr>';
    return;
  }

  contactsList.innerHTML = contacts.map(contact => `
    <tr>
      <td>${escapeHtml(contact.surname)} ${escapeHtml(contact.firstName)} ${escapeHtml(contact.patronymic)}</td>
      <td>${escapeHtml(contact.email)}</td>
      <td class="text-end text-nowrap">
        <button class="btn btn-sm btn-secondary edit-btn" data-id="${contact._id}">Change</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${contact._id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Show one page section and mark its nav link active
function showPage(pageId) {
  pages.forEach(page => {
    page.hidden = page.id !== pageId;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.hash === `#${pageId}`);
  });
}

// Sort table by column
function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }

  const order = currentSort.direction === 'asc' ? 1 : -1;
  const sorted = [...allContacts].sort((a, b) =>
    (a[field] || '').localeCompare(b[field] || '') * order
  );

  renderContactsTable(sorted);
}

// Open edit modal
function openEditModal(contactId) {
  const contact = allContacts.find(c => c._id === contactId);
  if (!contact) return;

  editForm.elements.id.value = contact._id;
  editForm.elements.surname.value = contact.surname;
  editForm.elements.firstName.value = contact.firstName;
  editForm.elements.patronymic.value = contact.patronymic || '';
  editForm.elements.email.value = contact.email;

  bootstrap.Modal.getOrCreateInstance(editModal).show();
}

// Delete contact
async function deleteContact(contactId) {
  if (!confirm('Are you sure you want to delete this contact?')) return;

  try {
    await api.deleteContact(contactId);
    showToast('Success', UI_MESSAGES.SUCCESS.CONTACT_DELETED, TOAST_TYPES.SUCCESS);
    loadContacts();
  } catch (error) {
    showToast('Error', error.message, TOAST_TYPES.ERROR);
  }
}

// Load contacts
async function loadContacts() {
  try {
    allContacts = await api.getContacts();
    selectedContacts.clear();
    selectAllCheckbox.checked = false;
    renderContactsTable(allContacts);
    renderContactsList(allContacts);
    updateSelectedCount();
  } catch (error) {
    showToast('Error', UI_MESSAGES.ERROR.LOAD_CONTACTS, TOAST_TYPES.ERROR);
  }
}

// Load templates
async function loadTemplates() {
  try {
    allTemplates = await api.getTemplates();
    renderTemplates(allTemplates);
  } catch (error) {
    showToast('Error', UI_MESSAGES.ERROR.LOAD_TEMPLATES, TOAST_TYPES.ERROR);
  }
}

// Fill subject and body from the chosen template
function onTemplateChange() {
  const template = allTemplates.find(t => t.key === emailForm.elements.template.value);
  emailForm.elements.subject.value = template ? template.subject : '';
  emailForm.elements.body.value = template ? template.body : '';
}

async function onSendEmail(e) {
  e.preventDefault();

  if (selectedContacts.size === 0) {
    showToast('Error', UI_MESSAGES.ERROR.NO_RECIPIENTS, TOAST_TYPES.ERROR);
    return;
  }

  const subject = emailForm.elements.subject.value.trim();
  const body = emailForm.elements.body.value.trim();

  if (!subject) {
    showToast('Error', UI_MESSAGES.ERROR.NO_SUBJECT, TOAST_TYPES.ERROR);
    return;
  }
  if (!body) {
    showToast('Error', UI_MESSAGES.ERROR.NO_MESSAGE, TOAST_TYPES.ERROR);
    return;
  }

  const sendButton = emailForm.querySelector('button[type="submit"]');
  sendButton.disabled = true;
  sendButton.textContent = 'Sending...';

  try {
    const result = await api.sendEmail(subject, body, [...selectedContacts]);
    if (result.failed > 0) {
      showToast('Warning', UI_MESSAGES.WARNING.EMAIL_PARTIAL(result.sent, result.failed), TOAST_TYPES.WARNING);
      return;
    }
    showToast('Success', UI_MESSAGES.SUCCESS.EMAIL_SENT(result.sent), TOAST_TYPES.SUCCESS);
    selectedContacts.clear();
    selectAllCheckbox.checked = false;
    renderContactsTable(allContacts);
    updateSelectedCount();
  } catch (error) {
    showToast('Error', error.message, TOAST_TYPES.ERROR);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'Send Email';
  }
}

async function onAddContact(e) {
  e.preventDefault();
  const { surname, firstName, patronymic, email } = addForm.elements;

  try {
    await api.createContact(surname.value, firstName.value, patronymic.value, email.value);
    showToast('Success', UI_MESSAGES.SUCCESS.CONTACT_ADDED, TOAST_TYPES.SUCCESS);
    addForm.reset();
    loadContacts();
  } catch (error) {
    showToast('Error', error.message, TOAST_TYPES.ERROR);
  }
}

async function onEditContact(e) {
  e.preventDefault();
  const { id, surname, firstName, patronymic, email } = editForm.elements;

  try {
    await api.updateContact(id.value, surname.value, firstName.value, patronymic.value, email.value);
    showToast('Success', UI_MESSAGES.SUCCESS.CONTACT_UPDATED, TOAST_TYPES.SUCCESS);
    bootstrap.Modal.getInstance(editModal).hide();
    loadContacts();
  } catch (error) {
    showToast('Error', error.message, TOAST_TYPES.ERROR);
  }
}

// Setup event listeners
function setupEventListeners() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.hash.slice(1));
    });
  });

  // One listener on the table handles every row checkbox
  contactsTable.addEventListener('change', (e) => {
    if (!e.target.classList.contains('contact-checkbox')) return;

    if (e.target.checked) {
      selectedContacts.add(e.target.value);
    } else {
      selectedContacts.delete(e.target.value);
    }
    updateSelectedCount();
  });

  selectAllCheckbox.addEventListener('change', () => {
    selectedContacts.clear();
    if (selectAllCheckbox.checked) {
      allContacts.forEach(c => selectedContacts.add(c._id));
    }
    document.querySelectorAll('.contact-checkbox').forEach(cb => {
      cb.checked = selectAllCheckbox.checked;
    });
    updateSelectedCount();
  });

  sortHeaders.forEach(header => {
    header.addEventListener('click', () => sortTable(header.dataset.sort));
  });

  // One listener on the list handles every Edit/Delete button
  contactsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      openEditModal(e.target.dataset.id);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteContact(e.target.dataset.id);
    }
  });

  emailForm.elements.template.addEventListener('change', onTemplateChange);
  emailForm.addEventListener('submit', onSendEmail);
  addForm.addEventListener('submit', onAddContact);
  editForm.addEventListener('submit', onEditContact);
}
