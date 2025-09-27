'use strict';

const headers = document.querySelectorAll('th');
const tBody = document.querySelector('tbody');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const tRows = Array.from(tBody.querySelectorAll('tr'));
    let sortDesc;

    if (
      !header.classList.contains('asc') &&
      !header.classList.contains('desc')
    ) {
      header.classList.add('asc');
      sortDesc = false;
    } else if (header.classList.contains('asc')) {
      header.classList.remove('asc');
      header.classList.add('desc');
      sortDesc = true;
    } else {
      header.classList.remove('desc');
      header.classList.add('asc');
      sortDesc = false;
    }

    headers.forEach((h) => {
      if (h !== header) {
        h.classList.remove('asc', 'desc');
      }
    });

    tRows.sort((a, b) => {
      const firstParam = a.children[index].textContent.trim();
      const secondParam = b.children[index].textContent.trim();

      if (index <= 2) {
        return sortDesc
          ? secondParam.localeCompare(firstParam)
          : firstParam.localeCompare(secondParam);
      }

      if (index === 3 || index === 4) {
        const first = Number(firstParam.replace(/[$,]/g, ''));
        const second = Number(secondParam.replace(/[$,]/g, ''));

        return sortDesc ? second - first : first - second;
      }
    });

    tBody.innerHTML = '';
    tRows.forEach((row) => tBody.appendChild(row));
  });
});

tBody.addEventListener('click', (e) => {
  const allTr = tBody.querySelectorAll('tr');
  const closest = e.target.closest('tr');

  if (closest.classList.contains('active')) {
    closest.classList.remove('active');
  } else {
    allTr.forEach((row) => row.classList.remove('active'));
    closest.classList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

function createInput(labelText, fieldName, type, dataQa) {
  const label = document.createElement('label');
  let field;

  if (type === 'select') {
    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    field = document.createElement('select');
    field.name = fieldName;
    field.setAttribute('data-qa', dataQa);

    options.forEach((opt) => {
      const optionElement = document.createElement('option');

      optionElement.value = opt;
      optionElement.textContent = opt;
      field.append(optionElement);
    });
  } else {
    field = document.createElement('input');
    field.name = fieldName;
    field.type = type;
    field.setAttribute('data-qa', dataQa);
  }

  label.append(labelText, field);
  form.appendChild(label);
}

createInput('Name: ', 'employeeName', 'text', 'name');
createInput('Position: ', 'employeePosition', 'text', 'position');
createInput('Office: ', 'employeeOffice', 'select', 'office');
createInput('Age: ', 'employeeAge', 'number', 'age');
createInput('Salary: ', 'employeeSalary', 'number', 'salary');

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.querySelector('[data-qa="name"]').value.trim();
  const employeePosition = form
    .querySelector('[data-qa="position"]')
    .value.trim();
  const employeeOffice = form.querySelector('[data-qa="office"]').value.trim();
  const employeeAge = form.querySelector('[data-qa="age"]').value.trim();
  const employeeSalary = form.querySelector('[data-qa="salary"]').value.trim();

  function showNotification(message, type) {
    const existing = document.querySelector('[data-qa="notification"]');

    if (existing) {
      existing.remove();
    }

    const div = document.createElement('div');

    div.textContent = message;
    div.setAttribute('data-qa', 'notification');
    div.classList.add(type);

    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.right = '20px';
    div.style.padding = '10px 20px';
    div.style.borderRadius = '5px';

    div.style.backgroundColor =
      type === 'error' ? 'rgba(255,0,0,0.7)' : 'rgba(0,128,0,0.7)';
    div.style.color = 'white';
    div.style.fontWeight = 'bold';
    div.style.zIndex = '1000';

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 2000);
  }

  if (
    !employeeName ||
    employeeName.length < 4 ||
    !employeePosition ||
    employeePosition.trim() === '' ||
    Number(employeeAge) < 18 ||
    Number(employeeAge) > 90
  ) {
    showNotification('Error: check Name, Position or Age!', 'error');

    return;
  }

  showNotification('Success: employee added!', 'success');

  const tr = document.createElement('tr');
  const info = [
    employeeName,
    employeePosition,
    employeeOffice,
    employeeAge,
    employeeSalary,
  ];

  info.forEach((param) => {
    const td = document.createElement('td');

    td.textContent =
      param === employeeSalary
        ? '$' + Number(employeeSalary).toLocaleString()
        : param;
    tr.append(td);
  });

  tBody.append(tr);
  form.reset();
});
