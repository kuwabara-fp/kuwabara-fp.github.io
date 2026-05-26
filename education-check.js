const resultCard = document.getElementById('result-card');
const resultTitle = document.getElementById('result-title');
const resultCopy = document.getElementById('result-copy');
const resultScore = document.getElementById('result-score');
const resultNext = document.getElementById('result-next');
const form = document.getElementById('education-check-form');
const resetButton = document.getElementById('reset-check');
const resultLineLink = document.getElementById('result-line-link');

const lineOfficialAccountId = '@771xcevp';
const lineFallbackUrl = 'https://lin.ee/rTetBKJ';
const isMobileLineSupported = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

const resultPatterns = [
  {
    min: 10,
    title: '準備が進んでいるタイプです',
    copy: '教育費に対する意識が高く、家計の中での位置づけも見えています。今後は、進路別の必要額と積立方法の精度を上げるとさらに安心しやすくなります。',
    next: [
      '高校・大学の進路パターンごとに必要額をざっくり試算する',
      '積立額が現在の家計に無理なく続くかを確認する',
      '住宅や老後資金とのバランスも年1回見直す'
    ]
  },
  {
    min: 6,
    title: 'あと少しで整うタイプです',
    copy: '教育費への意識は十分ありますが、必要額の見積もりや積立ルールが少し曖昧かもしれません。数字を見える化すると、安心感が大きく変わります。',
    next: [
      '毎月いくら教育費に回すかを家計の中で決める',
      '児童手当やボーナスの使い道を一度固定してみる',
      '家族で教育方針とお金の優先順位を話し合う'
    ]
  },
  {
    min: 0,
    title: '優先順位の整理から始めるタイプです',
    copy: '教育費の備えは、まだこれから整理していけば大丈夫です。いきなり完璧を目指すより、今の家計で無理なく始められる方法を決めることが先です。',
    next: [
      '毎月の家計を一度一覧にして、固定費を確認する',
      '教育費で不安な時期を1つだけ決めて必要額を調べる',
      '今の家計で積立できそうな金額の目安を出してみる'
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
  resultNext.innerHTML = '';
  matched.next.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    resultNext.appendChild(li);
  });


  const lineMessage = [
    '教育費準備度チェックの結果を送ります。',
    `診断結果：${matched.title}`,
    `点数：${total}点 / 12点`,
    `コメント：${matched.copy}`,
    '次にやること：',
    ...matched.next.map((item, index) => `${index + 1}. ${item}`)
  ].join('\n');

  if (resultLineLink) {
    const encodedLineId = encodeURIComponent(lineOfficialAccountId);
    if (lineOfficialAccountId && isMobileLineSupported) {
      resultLineLink.href = `https://line.me/R/oaMessage/${encodedLineId}/?${encodeURIComponent(lineMessage)}`;
    } else {
      resultLineLink.href = lineFallbackUrl;
    }
  }

  resultCard.classList.remove('result-hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

resetButton.addEventListener('click', () => {
  form.reset();
  resultCard.classList.add('result-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
