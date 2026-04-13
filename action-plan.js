const storageKey = 'kuwabara-fp-action-plan-v1';
const form = document.getElementById('action-plan-form');
const saveButton = document.getElementById('save-plan');
const printButton = document.getElementById('print-plan');
const clearButton = document.getElementById('clear-plan');
const saveStatus = document.getElementById('save-status');
const progressLabel = document.getElementById('progress-label');

const formElements = Array.from(form.querySelectorAll('textarea, input[type="text"], input[type="checkbox"]'));

const updateTaskState = () => {
  const taskRows = form.querySelectorAll('.task-row');
  let done = 0;

  taskRows.forEach((row) => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    row.classList.toggle('is-complete', checkbox.checked);
    if (checkbox.checked) done += 1;
  });

  progressLabel.textContent = `進捗：${done} / ${taskRows.length} 完了`;
};

const readFormData = () => {
  const data = {};
  formElements.forEach((el) => {
    if (el.type === 'checkbox') {
      data[el.name] = el.checked;
    } else {
      data[el.name] = el.value;
    }
  });
  return data;
};

const writeFormData = (data) => {
  formElements.forEach((el) => {
    if (!(el.name in data)) return;
    if (el.type === 'checkbox') {
      el.checked = Boolean(data[el.name]);
    } else {
      el.value = data[el.name];
    }
  });
  updateTaskState();
};

const saveData = () => {
  const data = readFormData();
  localStorage.setItem(storageKey, JSON.stringify(data));
  const time = new Date();
  saveStatus.textContent = `保存済み：${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
};

const loadData = () => {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    updateTaskState();
    return;
  }

  try {
    const data = JSON.parse(saved);
    writeFormData(data);
    saveStatus.textContent = '前回保存した内容を読み込みました';
  } catch (error) {
    saveStatus.textContent = '保存データを読み込めませんでした';
  }
};

saveButton.addEventListener('click', saveData);

printButton.addEventListener('click', () => {
  window.print();
});

clearButton.addEventListener('click', () => {
  const agreed = window.confirm('入力した内容をこの端末から削除します。よろしいですか？');
  if (!agreed) return;

  form.reset();
  localStorage.removeItem(storageKey);
  saveStatus.textContent = '内容を削除しました';
  updateTaskState();
});

formElements.forEach((el) => {
  el.addEventListener('input', updateTaskState);
  el.addEventListener('change', updateTaskState);
});

loadData();
