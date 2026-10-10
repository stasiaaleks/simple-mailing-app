const contactsTable = document.querySelector('#contacts-table');
const selectAllCheckbox = document.querySelector('#select-all');
const sortHeaders = document.querySelectorAll('th[data-sort]');
const selectedCount = document.querySelector('#selected-count');
const emailForm = document.querySelector('#email-form');

let allContacts = [];
let allTemplates = [];
let selectedContacts = new Set();
let currentSort = { field: 'surname', direction: 'asc' };

function updateSelectedCount() {
  selectedCount.textContent = selectedContacts.size;
}

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

function renderTemplates(templates) {
  emailForm.elements.template.innerHTML = '<option value="">Select a template...</option>' +
    templates.map(t => `<option value="${t.key}">${escapeHtml(t.subject)}</option>`).join('');
}

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

async function loadContacts() {
  try {
    allContacts = await api.getContacts();
    renderContactsTable(allContacts);
  } catch (error) {
    showToast('Error', UI_MESSAGES.ERROR.LOAD_CONTACTS, TOAST_TYPES.ERROR);
  }
}

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
    sendButton.textContent = 'Send email';
  }
}

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

emailForm.elements.template.addEventListener('change', onTemplateChange);
emailForm.addEventListener('submit', onSendEmail);

loadContacts();
loadTemplates();
