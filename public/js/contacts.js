const contactsList = document.querySelector('#contacts-list');
const addForm = document.querySelector('#add-contact-form');
const editForm = document.querySelector('#edit-contact-form');
const editModal = document.querySelector('#edit-modal');

let allContacts = [];

function renderContactsList(contacts) {
  if (contacts.length === 0) {
    contactsList.innerHTML = '<tr><td colspan="3" class="text-muted">No contacts</td></tr>';
    return;
  }

  contactsList.innerHTML = contacts.map(contact => {
    const surname = escapeHtml(contact.surname);
    const firstName = escapeHtml(contact.firstName);
    const email = escapeHtml(contact.email);

    return `
      <tr>
        <td>${surname} ${firstName}</td>
        <td>${email}</td>
        <td class="text-end text-nowrap">
          <button class="btn btn-sm btn-secondary edit-btn" data-id="${contact._id}">Change</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${contact._id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function loadContacts() {
  try {
    allContacts = await api.getContacts();
    renderContactsList(allContacts);
  } catch (error) {
    showToast('Error', UI_MESSAGES.ERROR.LOAD_CONTACTS, TOAST_TYPES.ERROR);
  }
}

function openEditModal(contactId) {
  const contact = allContacts.find(c => c._id === contactId);
  if (!contact) return;

  editForm.elements.id.value = contact._id;
  editForm.elements.surname.value = contact.surname;
  editForm.elements.firstName.value = contact.firstName;
  editForm.elements.email.value = contact.email;

  bootstrap.Modal.getOrCreateInstance(editModal).show();
}

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

async function onAddContact(e) {
  e.preventDefault();
  const { surname, firstName, email } = addForm.elements;

  try {
    await api.createContact(surname.value, firstName.value, email.value);
    showToast('Success', UI_MESSAGES.SUCCESS.CONTACT_ADDED, TOAST_TYPES.SUCCESS);
    addForm.reset();
    loadContacts();
  } catch (error) {
    showToast('Error', error.message, TOAST_TYPES.ERROR);
  }
}

async function onEditContact(e) {
  e.preventDefault();
  const { id, surname, firstName, email } = editForm.elements;

  try {
    await api.updateContact(id.value, surname.value, firstName.value, email.value);
    showToast('Success', UI_MESSAGES.SUCCESS.CONTACT_UPDATED, TOAST_TYPES.SUCCESS);
    bootstrap.Modal.getInstance(editModal).hide();
    loadContacts();
  } catch (error) {
    showToast('Error', error.message, TOAST_TYPES.ERROR);
  }
}

// One listener on the list handles every Edit/Delete button
contactsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    openEditModal(e.target.dataset.id);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteContact(e.target.dataset.id);
  }
});

addForm.addEventListener('submit', onAddContact);
editForm.addEventListener('submit', onEditContact);

loadContacts();
