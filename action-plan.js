const form = document.getElementById('precheck-form');
const resultCard = document.getElementById('result-card');
const resultTitle = document.getElementById('result-title');
const resultCopy = document.getElementById('result-copy');
const resultScore = document.getElementById('result-score');
const resultNext = document.getElementById('result-next');
const resetButton = document.getElementById('reset-check');

const patterns = [
  {
    min: 8,
    title: '相談準備が進んでいるタイプです',
    copy: '相談したいテーマと準備状況がかなり整っています。LINEで一言送っていただければ、次の一歩はかなりスムーズです。',
    score: '目安：8〜10点',
    next: [
      '相談したいテーマを1つに絞って送る',
      '家計や保険の資料があれば手元に置く',
      '必要ならそのままSpirで日程を選ぶ'
    ]
  },
  {
    min: 4,
    title: 'あと少しで整うタイプです',
    copy: '悩みはある程度見えています。相談前に、気になることを1行だけ言葉にしておくと、面談が進めやすくなります。',
    score: '目安：4〜7点',
    next: [
      '今いちばん気になることを1行で書く',
      '家計の固定費だけざっくり確認する',
      'LINEで送る内容を短くまとめる'
    ]
  },
  {
    min: 0,
    title: 'まずは整理から始めるタイプです',
    copy: 'まだ迷いが多い状態でも大丈夫です。相談の入口づくりから始めて、何を優先するかを一緒に見つけるのが合っています。',
    score: '目安：0〜3点',
    next: [
      '今いちばん不安なことを1つだけ書く',
      '家族に話しにくいことをメモにする',
      'まずはLINEで状況を送ってみる'
    ]
  }
];

const getValue = (name) => {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? Number(checked.value) : 0;
};

const renderResult = (total) => {
  const matched = patterns.find((p) => total >= p.min) || patterns[patterns.length - 1];
  resultTitle.textContent = matched.title;
  resultCopy.textContent = matched.copy;
  resultScore.textContent = matched.score;
  resultNext.innerHTML = matched.next.map((item) => `<li>${item}</li>`).join('');
  resultCard.classList.remove('result-hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const total = ['q1', 'q2', 'q3', 'q4', 'q5'].reduce((sum, name) => sum + getValue(name), 0);
  renderResult(total);
});

resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('result-hidden');
  resultTitle.textContent = '';
  resultCopy.textContent = '';
  resultScore.textContent = '';
  resultNext.innerHTML = '';
});
