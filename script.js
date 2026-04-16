const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.global-nav');
const header = document.querySelector('.site-header');

const closeNav = () => {
  if (!toggle || !nav) return;
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
};

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth > 960) return;
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeNav();
    }
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

const updateAge = () => {
  const ageEl = document.getElementById('age-display');
  if (!ageEl) return;

  const birthText = ageEl.dataset.birth;
  if (!birthText) return;

  const parts = birthText.split('-').map((value) => Number(value));
  if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) return;

  const [year, month, day] = parts;
  const today = new Date();
  let age = today.getFullYear() - year;

  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) age -= 1;
  ageEl.textContent = String(age);
};

const setupReveal = () => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  targets.forEach((el) => observer.observe(el));
};

const initSite = () => {
  updateHeader();
  updateAge();
  setupReveal();
  setupSpirConfirm();
  setupInlineDiagnosis();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}

window.addEventListener('scroll', updateHeader, { passive: true });


const setupSpirConfirm = () => {
  const spirLinks = document.querySelectorAll('a[href*="spirinc.com"]');
  if (!spirLinks.length) return;

  spirLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const ok = window.confirm('Spirサイトに遷移しますが、よろしいですか？');
      if (!ok) {
        event.preventDefault();
      }
    });
  });
};


const setupInlineDiagnosis = () => {
  const form = document.getElementById('inline-diagnosis-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.diag-step'));
  const prevButton = document.getElementById('diag-prev');
  const resetButton = document.getElementById('diag-reset');
  const progressText = document.getElementById('diag-progress-text');
  const progressBar = document.getElementById('diag-progress-bar');
  const resultCard = document.getElementById('diag-result');
  const resultTitle = document.getElementById('diag-result-title');
  const resultCopy = document.getElementById('diag-result-copy');
  const resultNote = document.getElementById('diag-result-note');
  const lineMessage = document.getElementById('diag-line-message');
  const lineLink = document.getElementById('diag-line-link');
  const copyButton = document.getElementById('diag-copy');
  const summaryTheme = document.getElementById('diag-summary-theme');
  const summaryClarity = document.getElementById('diag-summary-clarity');
  const summaryUrgency = document.getElementById('diag-summary-urgency');
  const summaryContact = document.getElementById('diag-summary-contact');

  const body = document.body;
  const lineOfficialAccountId = (body.dataset.lineOaId || '').trim();
  const lineFallbackUrl = body.dataset.lineFallbackUrl || 'https://lin.ee/rTetBKJ';
  const isMobileLineSupported = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

  const labels = {
    theme: {
      kakei: '頑張っているのに貯まりにくい',
      future: '教育費・住宅・老後が同時に気になる',
      start: '夫婦で何から話せばいいか整理したい'
    },
    clarity: {
      high: '大枠はつかめている',
      mid: '一部だけ分かる',
      low: '忙しくて後回しになっている'
    },
    urgency: {
      high: '今の家計の優先順位をはっきりさせたい',
      mid: '教育費・住宅・老後のバランスを見たい',
      low: '夫婦で話しやすい整理メモがほしい'
    },
    contact: {
      line: 'まずはLINEで状況を送って整理したい',
      reserve: '面談予約をしてまとめて相談したい',
      hesitate: 'まだ迷うので送る内容を整えたい'
    }
  };

  const themeLead = {
    kakei: '毎月のやりくりと貯蓄のバランスを整理したいです。',
    future: '教育費・住宅・老後のお金を、どんな順番で考えるとよいか整理したいです。',
    start: '夫婦で何から話し始めるとよいか、整理したいです。'
  };

  const answers = {
    theme: '',
    clarity: '',
    urgency: '',
    contact: ''
  };

  let currentStep = 0;

  const updateProgress = () => {
    const stepNumber = currentStep + 1;
    progressText.textContent = `質問 ${stepNumber} / ${steps.length}`;
    progressBar.style.width = `${(stepNumber / steps.length) * 100}%`;
    prevButton.disabled = currentStep === 0;
  };

  const showStep = (index) => {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => {
      const active = stepIndex === currentStep;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });
    updateProgress();
  };

  const getDiagnosis = () => {
    if ((answers.contact === 'reserve' && answers.urgency !== 'low') || (answers.clarity === 'high' && answers.urgency === 'high')) {
      return {
        title: '面談でまとめて整理すると進みやすい状態です',
        copy: '家計の現状と相談したい優先順位がある程度見えています。共働きや子育てで忙しい中でも、面談で一度まとめて整理すると、その後の判断がかなりしやすくなりそうです。'
      };
    }

    if (answers.contact === 'hesitate' || answers.clarity === 'low' || answers.theme === 'start' || answers.urgency === 'low') {
      return {
        title: 'まずはLINEで状況を送るのが向いています',
        copy: 'まだ考えが途中でも問題ありません。共働き子育て世帯は、悩みがまとまる前に時間だけ過ぎやすいので、まずは今の状況を短く送って、整理の入口を作るのがおすすめです。'
      };
    }

    return {
      title: 'LINEで相談を始めやすい状態です',
      copy: '悩みの軸がある程度見えています。今の家計と将来のお金の不安を、下の文面のまま送るだけでも、次に何を確認すべきかが整理しやすくなります。'
    };
  };

  const buildLineMessage = () => {
    const diagnosis = getDiagnosis();
    return [
      'こんにちは。ホームページの4問チェックをやってみました。',
      '',
      `【診断結果】${diagnosis.title}`,
      `【今いちばん近い不安】${labels.theme[answers.theme]}`,
      `【家計や将来資金の見え方】${labels.clarity[answers.clarity]}`,
      `【相談して整えたいこと】${labels.urgency[answers.urgency]}`,
      `【今の気持ち】${labels.contact[answers.contact]}`,
      '',
      `${themeLead[answers.theme]}`,
      '共働きと子育てで後回しになりがちなので、どこから整理するとよいか相談したいです。'
    ].join('
');
  };

  const renderResult = () => {
    const diagnosis = getDiagnosis();
    const message = buildLineMessage();

    resultTitle.textContent = diagnosis.title;
    resultCopy.textContent = diagnosis.copy;
    summaryTheme.textContent = labels.theme[answers.theme];
    summaryClarity.textContent = labels.clarity[answers.clarity];
    summaryUrgency.textContent = labels.urgency[answers.urgency];
    summaryContact.textContent = labels.contact[answers.contact];
    lineMessage.value = message;
    lineLink.dataset.message = message;

    if (lineOfficialAccountId && isMobileLineSupported) {
      const encodedLineId = encodeURIComponent(lineOfficialAccountId);
      lineLink.href = `https://line.me/R/oaMessage/${encodedLineId}/?${encodeURIComponent(message)}`;
      lineLink.dataset.mode = 'oa';
      resultNote.textContent = 'スマホでは、LINE公式アカウントの入力欄にこの文面を入れた状態で開きます。';
    } else {
      lineLink.href = lineFallbackUrl;
      lineLink.dataset.mode = 'fallback';
      resultNote.textContent = 'このサイトには現在LINEの短縮リンクが設定されています。クリック時に相談メモをコピーしてからLINEを開くようにしています。LINE公式アカウントのベーシックIDを設定すると、入力欄プリセットにも切り替えられます。';
    }

    resultCard.classList.remove('result-hidden');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const resetDiagnosis = () => {
    Object.keys(answers).forEach((key) => {
      answers[key] = '';
    });

    form.querySelectorAll('.diag-option').forEach((button) => {
      button.classList.remove('is-selected');
    });

    resultCard.classList.add('result-hidden');
    showStep(0);
  };

  const copyMessage = async () => {
    if (!lineMessage.value) return false;
    try {
      await navigator.clipboard.writeText(lineMessage.value);
      copyButton.textContent = 'コピーしました';
      window.setTimeout(() => {
        copyButton.textContent = '相談メモをコピー';
      }, 1800);
      return true;
    } catch (error) {
      lineMessage.focus();
      lineMessage.select();
      return false;
    }
  };

  steps.forEach((step, index) => {
    step.querySelectorAll('.diag-option').forEach((button) => {
      button.addEventListener('click', () => {
        const question = step.dataset.question;
        answers[question] = button.dataset.value;
        step.querySelectorAll('.diag-option').forEach((option) => {
          option.classList.remove('is-selected');
        });
        button.classList.add('is-selected');

        if (index < steps.length - 1) {
          window.setTimeout(() => showStep(index + 1), 120);
          return;
        }

        window.setTimeout(renderResult, 120);
      });
    });
  });

  prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  resetButton.addEventListener('click', resetDiagnosis);
  copyButton.addEventListener('click', async () => {
    await copyMessage();
  });

  lineLink.addEventListener('click', async (event) => {
    const mode = lineLink.dataset.mode || 'fallback';
    if (mode !== 'oa') {
      await copyMessage();
      return;
    }

    if (!isMobileLineSupported) {
      event.preventDefault();
      await copyMessage();
      window.open(lineFallbackUrl, '_blank', 'noopener');
    }
  });

  showStep(0);
};
