const emailsList = document.querySelector('#emails-list');

// DOMParser reads the HTML without running scripts, so we can safely take its plain text
function htmlToText(html) {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent;
}

function renderRecipient(recipient) {
  const email = escapeHtml(recipient.email);
  if (recipient.success) {
    return `<li>${email}</li>`;
  }
  return `<li class="text-danger">${email} — ${escapeHtml(recipient.error)}</li>`;
}

function renderEmailsList(emails) {
  if (emails.length === 0) {
    emailsList.innerHTML = '<tr><td colspan="6" class="text-muted">No emails sent yet</td></tr>';
    return;
  }

  emailsList.innerHTML = emails.map(email => `
    <tr>
      <td class="text-nowrap">${new Date(email.createdAt).toLocaleString()}</td>
      <td>${escapeHtml(email.subject)}</td>
      <td>${escapeHtml(htmlToText(email.body))}</td>
      <td>
        <ul class="list-unstyled mb-0">${email.recipients.map(renderRecipient).join('')}</ul>
      </td>
      <td>${email.sent}</td>
      <td class="${email.failed > 0 ? 'text-danger' : ''}">${email.failed}</td>
    </tr>
  `).join('');
}

async function loadEmails() {
  try {
    renderEmailsList(await api.getEmails());
  } catch (error) {
    showToast('Error', UI_MESSAGES.ERROR.LOAD_EMAILS, TOAST_TYPES.ERROR);
  }
}

loadEmails();
