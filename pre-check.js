const resultCard = document.getElementById('result-card');
const resultTitle = document.getElementById('result-title');
const resultCopy = document.getElementById('result-copy');
const resultScore = document.getElementById('result-score');
const resultThemes = document.getElementById('result-themes');
const resultNext = document.getElementById('result-next');
const form = document.getElementById('pre-check-form');
const resetButton = document.getElementById('reset-check');

const resultPatterns = [
  {
    min: 9,
    title: '家計の基盤が整っているタイプです',
    copy: '収支・保険・積立の把握が進んでいます。今後は将来資金のシナリオを数字で確認し、「足りているか」を検証するフェーズに進めます。',
    themes: ['将来資金の見通し精度アップ', '積立方法の最適化', 'ライフプランシミュレーション'],
    next: [
      '教育費・住宅・老後の必要額を試算する',
      '積立額が家計に無理なく続くかを確認する',
      '今後10〜20年の資金の流れをシナリオ化する'
    ]
  },
  {
    min: 5,
    title: '整理を始めるベストタイミングです',
    copy: '気になっていることはあるが、まだ数字や方向性が曖昧な状態です。この段階でFP相談を受けると、優先順位が明確になり動きやすくなります。',
    themes: ['家計の見える化', '保険内容の整理', '積立ルールを決める'],
    next: [
      '毎月の固定費を一覧にして確認する',
      '保険証券を集めて保障内容を整理する',
      '将来に向けた積立の目的と金額を決める'
    ]
  },
  {
    min: 0,
    title: 'まず「現在地の確認」から始めましょう',
    copy: '家計・保険・将来資金のいずれかで把握できていない部分があります。いきなり完璧を目指すより、今の状況をざっくり整理することが先です。',
    themes: ['毎月の収支の把握', '保険の全体確認', '将来不安の言語化'],
    next: [
      '今月の収入と支出をざっくり書き出してみる',
      '加入保険の名称と月額保険料を一覧にする',
      '「一番気になっていること」をひとつだけ決める'
    ]
  }
];

const getCheckedValue = (name) => {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? Number(checked.value) : null;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const answers = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].map(getCheckedValue);
  const hasEmpty = answers.some((value) => value === null);

  if (hasEmpty) {
    alert('すべての質問に回答してください。');
    return;
  }

  const total = answers.reduce((sum, value) => sum + value, 0);
  const matched = resultPatterns.find((pattern) => total >= pattern.min) || resultPatterns[resultPatterns.length - 1];

  resultTitle.textContent = matched.title;
  resultCopy.textContent = matched.copy;
  resultScore.textContent = `合計点：${total}点 / 12点`;

  // Render themes
  resultThemes.innerHTML = '';
  const themesWrap = document.createElement('div');
  themesWrap.className = 'result-themes-inner';
  const themesLabel = document.createElement('p');
  themesLabel.className = 'result-themes-label';
  themesLabel.textContent = '相談で整理したいテーマ';
  themesWrap.appendChild(themesLabel);
  const chipRow = document.createElement('div');
  chipRow.className = 'result-themes-chips';
  matched.themes.forEach((theme) => {
    const chip = document.createElement('span');
    chip.className = 'result-theme-chip';
    chip.textContent = theme;
    chipRow.appendChild(chip);
  });
  themesWrap.appendChild(chipRow);
  resultThemes.appendChild(themesWrap);

  resultNext.innerHTML = '';
  matched.next.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    resultNext.appendChild(li);
  });

  resultCard.classList.remove('result-hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('result-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
