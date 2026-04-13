const form = document.getElementById('consultation-prep-form');
const resultCard = document.getElementById('prep-result');
const resultTitle = document.getElementById('prep-title');
const resultCopy = document.getElementById('prep-copy');
const resultNext = document.getElementById('prep-next');

const getAnswer = (name) => {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? Number(checked.value) : null;
};

const renderResult = ({ title, copy, next }) => {
  resultTitle.textContent = title;
  resultCopy.textContent = copy;
  resultNext.innerHTML = next.map((item) => `<li>${item}</li>`).join('');
  resultCard.classList.remove('result-hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const values = ['q1', 'q2', 'q3', 'q4', 'q5'].map(getAnswer);
  if (values.some((value) => value === null)) {
    alert('すべての質問に回答してください。');
    return;
  }

  const score = values.reduce((sum, value) => sum + value, 0);

  if (score >= 8) {
    renderResult({
      title: 'かなり相談準備ができています',
      copy: '悩みのテーマと相談の流れが見えています。LINEで状況を一言送れば、そのまま日程調整や相談の整理に進みやすい状態です。',
      next: [
        'LINEで相談したいテーマを1つ送る',
        '手元にある資料があれば一緒に伝える',
        '予約したい時期を添える'
      ]
    });
    return;
  }

  if (score >= 4) {
    renderResult({
      title: '整理しながら進めるとスムーズです',
      copy: '相談したい方向性は見えていますが、資料や優先順位を少し整えると、面談がさらに進めやすくなります。',
      next: [
        'テーマを1つか2つに絞る',
        'ある資料だけでよいので用意する',
        'LINEで「気になっていること」を一言送る'
      ]
    });
    return;
  }

  renderResult({
    title: 'まずは一言送るところからで大丈夫です',
    copy: 'まだ悩みがまとまっていなくても問題ありません。無料相談では、現在地を一緒に整理するところから始められます。',
    next: [
      '今いちばん気になることを1つ書く',
      '希望時期は「未定」でも問題なし',
      'わからない点はそのまま送って大丈夫'
    ]
  });
});
