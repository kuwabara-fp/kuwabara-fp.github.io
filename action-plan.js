const form = document.getElementById('consult-precheck-form');
const resultCard = document.getElementById('result-card');
const resultTitle = document.getElementById('result-title');
const resultCopy = document.getElementById('result-copy');
const resultScore = document.getElementById('result-score');
const resultNext = document.getElementById('result-next');
const resetButton = document.getElementById('reset-check');

const patterns = [
  {
    min: 10,
    title: '相談に進みやすい状態です',
    copy: '悩みのテーマや優先順位がかなり見えています。LINEでひと言送れば、そのまま相談を進めやすい段階です。',
    scoreLabel: '相談準備度：かなり高い',
    next: [
      'LINEで相談したいテーマをひと言送る',
      '気になっている時期や期限をあわせて伝える',
      '必要ならSpirで日程を選ぶ'
    ]
  },
  {
    min: 6,
    title: '少し整理すると、もっと相談しやすくなります',
    copy: '相談したいことは見えていますが、家計や家族の話を少し整えると、よりスムーズに進めやすくなります。',
    scoreLabel: '相談準備度：途中まで整っている',
    next: [
      '気になるテーマを1つに絞る',
      '家計や貯蓄のざっくり感を確認する',
      'LINEで「気になっていること」を一文送る'
    ]
  },
  {
    min: 0,
    title: 'まずは整理から始めるのがおすすめです',
    copy: 'まだ悩みがまとまっていなくても大丈夫です。相談前に整理ツールを使うと、LINEで送る一言が作りやすくなります。',
    scoreLabel: '相談準備度：これから整える段階',
    next: [
      '教育費準備度チェックも試してみる',
      '気になっていることを箇条書きにする',
      'LINEで「相談したい」とだけ送る'
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
  if (answers.some((value) => value === null)) {
    alert('すべての質問に回答してください。');
    return;
  }

  const total = answers.reduce((sum, value) => sum + value, 0);
  const matched = patterns.find((pattern) => total >= pattern.min) || patterns[patterns.length - 1];

  resultTitle.textContent = matched.title;
  resultCopy.textContent = matched.copy;
  resultScore.textContent = `${matched.scoreLabel} / スコア ${total}点`;
  resultNext.innerHTML = matched.next.map((item) => `<li>${item}</li>`).join('');
  resultCard.classList.remove('result-hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('result-hidden');
  resultTitle.textContent = '結果';
  resultCopy.textContent = '';
  resultScore.textContent = '';
  resultNext.innerHTML = '';
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const first = document.querySelector('.question-card');
    if (first) first.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
}
