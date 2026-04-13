const form = document.getElementById('precheck-form');
const resetButton = document.getElementById('reset-precheck');
const resultCard = document.getElementById('result-card');
const resultTitle = document.getElementById('result-title');
const resultCopy = document.getElementById('result-copy');
const resultNext = document.getElementById('result-next');

const getValue = (name) => {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? Number(checked.value) : null;
};

const renderResult = (title, copy, nextItems) => {
  resultTitle.textContent = title;
  resultCopy.textContent = copy;
  resultNext.innerHTML = nextItems.map((item) => `<li>${item}</li>`).join('');
  resultCard.classList.remove('result-hidden');
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const answers = ['q1', 'q2', 'q3', 'q4', 'q5'].map(getValue);
  if (answers.some((value) => value === null)) {
    alert('すべての質問に回答してください。');
    return;
  }

  const total = answers.reduce((sum, value) => sum + value, 0);

  if (total >= 8) {
    renderResult(
      '相談の準備が進んでいるタイプです',
      'テーマや資料の整理が進んでいるので、相談に入るとすぐに具体策を詰めやすい状態です。まずはLINEで一言送り、気になる点を3つほど伝えると、予約後のやり取りもスムーズです。',
      [
        '聞きたいことを3つに絞って送る',
        '家計・保険・ローンの資料を手元に置く',
        'LINEで日程と相談の方向性を送る'
      ]
    );
    return;
  }

  if (total >= 5) {
    renderResult(
      '相談しながら整理すると進みやすいタイプです',
      '気になっていることはあるものの、まだ少し整理途中かもしれません。無料相談で順番を整えると、次に何を確認すべきかが見えやすくなります。',
      [
        '悩みを1〜2個に絞ってみる',
        '家計や保険の資料を1つだけでも確認する',
        '無料相談で優先順位を一緒に整理する'
      ]
    );
    return;
  }

  renderResult(
    'まずは無料相談で整理から始めるタイプです',
    'まだ相談内容がまとまっていなくても大丈夫です。LINEで一言送ってもらえれば、何を整理するとよいかを一緒に考えられます。',
    [
      '今いちばん気になることを一言で送る',
      '資料がなくても、そのまま相談して大丈夫です',
      'LINEで整理しながら、必要なら予約につなげる'
    ]
  );
});

resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('result-hidden');
  resultTitle.textContent = '';
  resultCopy.textContent = '';
  resultNext.innerHTML = '';
});
