(() => {
  const AI_PREP_URL = 'https://kuwabara-fp.github.io/fp-ai-consulting-demo/';
  const LINE_URL = 'https://lin.ee/rTetBKJ';

  const injectStyle = () => {
    if (document.getElementById('ai-prep-hero-style')) return;
    const style = document.createElement('style');
    style.id = 'ai-prep-hero-style';
    style.textContent = `
      .ai-prep-section {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(circle at 14% 20%, rgba(191, 154, 62, 0.16), transparent 30%),
          radial-gradient(circle at 92% 0%, rgba(31, 77, 147, 0.13), transparent 34%),
          linear-gradient(135deg, #ffffff 0%, #f7f9fd 58%, #f2efe6 100%);
        border-bottom: 1px solid rgba(31, 77, 147, 0.10);
      }
      .ai-prep-section .container { position: relative; z-index: 1; }
      .ai-prep-panel {
        display: grid;
        grid-template-columns: minmax(0, 1.08fr) minmax(280px, 0.92fr);
        gap: clamp(22px, 4vw, 46px);
        align-items: center;
        padding: clamp(26px, 5vw, 54px);
        border: 1px solid rgba(31, 77, 147, 0.12);
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.84);
        box-shadow: 0 24px 70px rgba(20, 43, 81, 0.10);
        backdrop-filter: blur(18px);
      }
      .ai-prep-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px;
        color: #9a7a24;
        font-weight: 900;
        letter-spacing: 0.08em;
        font-size: 0.82rem;
      }
      .ai-prep-eyebrow::before {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: linear-gradient(135deg, #bf9a3e, #2c8b57);
        box-shadow: 0 0 0 6px rgba(191, 154, 62, 0.12);
      }
      .ai-prep-panel h2 {
        margin: 0;
        color: var(--primary-dark, #10284f);
        font-size: clamp(1.8rem, 4.3vw, 3rem);
        line-height: 1.28;
        letter-spacing: -0.03em;
      }
      .ai-prep-lead {
        margin: 16px 0 0;
        color: #465571;
        font-weight: 700;
        line-height: 1.9;
        font-size: clamp(0.98rem, 2.1vw, 1.08rem);
      }
      .ai-prep-points {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin: 22px 0 0;
      }
      .ai-prep-point {
        display: grid;
        gap: 4px;
        padding: 14px 12px;
        border-radius: 18px;
        background: rgba(247, 249, 253, 0.95);
        border: 1px solid rgba(31, 77, 147, 0.10);
      }
      .ai-prep-point strong {
        color: var(--primary-dark, #10284f);
        font-size: 0.95rem;
      }
      .ai-prep-point span {
        color: #66728a;
        font-size: 0.78rem;
        font-weight: 700;
        line-height: 1.45;
      }
      .ai-prep-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-top: 24px;
      }
      .ai-prep-actions .button { min-width: 220px; }
      .ai-prep-note {
        margin: 14px 0 0;
        color: #69758c;
        font-size: 0.84rem;
        font-weight: 700;
        line-height: 1.6;
      }
      .ai-prep-phone {
        position: relative;
        max-width: 360px;
        justify-self: center;
        width: 100%;
        border: 10px solid #12264a;
        border-radius: 34px;
        background: #fff;
        box-shadow: 0 26px 70px rgba(18, 38, 74, 0.22);
        overflow: hidden;
      }
      .ai-prep-phone::before {
        content: '';
        display: block;
        width: 34%;
        height: 20px;
        margin: 0 auto;
        border-radius: 0 0 16px 16px;
        background: #12264a;
      }
      .ai-prep-phone-screen { padding: 18px 18px 20px; }
      .ai-prep-phone-kicker {
        color: #bf9a3e;
        font-size: 0.78rem;
        font-weight: 900;
        text-align: center;
      }
      .ai-prep-phone-title {
        margin: 4px 0 14px;
        color: #10284f;
        font-size: 1.22rem;
        font-weight: 900;
        text-align: center;
      }
      .ai-prep-mini-card {
        display: grid;
        gap: 6px;
        padding: 12px;
        margin-top: 10px;
        border: 1px solid rgba(31, 77, 147, 0.12);
        border-radius: 16px;
        background: #f8fafc;
      }
      .ai-prep-mini-card strong {
        color: #10284f;
        font-size: 0.86rem;
      }
      .ai-prep-mini-card span {
        color: #5c6880;
        font-size: 0.76rem;
        font-weight: 700;
        line-height: 1.5;
      }
      .ai-prep-progress {
        height: 9px;
        margin: 16px 0 2px;
        border-radius: 999px;
        background: #e8edf4;
        overflow: hidden;
      }
      .ai-prep-progress span {
        display: block;
        width: 72%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #bf9a3e, #2c8b57);
      }
      @media (max-width: 860px) {
        .ai-prep-panel { grid-template-columns: 1fr; padding: 24px 18px; border-radius: 24px; }
        .ai-prep-points { grid-template-columns: 1fr; }
        .ai-prep-actions { display: grid; }
        .ai-prep-actions .button { width: 100%; min-width: 0; }
        .ai-prep-phone { max-width: 310px; }
      }
    `;
    document.head.appendChild(style);
  };

  const insertSection = () => {
    if (document.getElementById('ai-prep')) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    injectStyle();

    const section = document.createElement('section');
    section.className = 'section ai-prep-section';
    section.id = 'ai-prep';
    section.innerHTML = `
      <div class="container">
        <div class="ai-prep-panel reveal">
          <div class="ai-prep-copy">
            <p class="ai-prep-eyebrow">AI相談準備デモ</p>
            <h2>相談前に、悩みを整理してみませんか？</h2>
            <p class="ai-prep-lead">教育費・住宅ローン・NISA・老後資金など、「何を相談すればよいか分からない」という状態を、スマホで気軽に整理できます。相談テーマ・必要資料・次に確認したいことを、申込前に見える化します。</p>
            <div class="ai-prep-points" aria-label="AI相談準備で整理できること">
              <div class="ai-prep-point"><strong>相談テーマ</strong><span>教育費・住宅・家計などを整理</span></div>
              <div class="ai-prep-point"><strong>必要資料</strong><span>面談前に見るものを確認</span></div>
              <div class="ai-prep-point"><strong>次の行動</strong><span>LINE相談・面談予約へ接続</span></div>
            </div>
            <div class="ai-prep-actions">
              <a class="button reserve lift-on-hover" href="${AI_PREP_URL}" rel="noopener noreferrer" target="_blank"><span>AI相談準備を試してみる</span></a>
              <a class="button line lift-on-hover" href="${LINE_URL}" rel="noopener noreferrer" target="_blank"><span>LINEで相談内容を送る</span></a>
            </div>
            <p class="ai-prep-note">入力は診断ではなく、相談前に論点を整理するためのものです。すべて埋めなくても大丈夫です。</p>
          </div>
          <div class="ai-prep-phone" aria-hidden="true">
            <div class="ai-prep-phone-screen">
              <p class="ai-prep-phone-kicker">AI相談準備</p>
              <p class="ai-prep-phone-title">悩みを整理中</p>
              <div class="ai-prep-progress"><span></span></div>
              <div class="ai-prep-mini-card"><strong>教育費の準備</strong><span>将来の支出と今の貯蓄ペースを確認</span></div>
              <div class="ai-prep-mini-card"><strong>住宅ローン</strong><span>返済と家計のバランスを整理</span></div>
              <div class="ai-prep-mini-card"><strong>NISA・資産形成</strong><span>目的と優先順位を相談前に確認</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    hero.insertAdjacentElement('afterend', section);

    if ('IntersectionObserver' in window) {
      const reveal = section.querySelector('.reveal');
      if (reveal) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        observer.observe(reveal);
      }
    } else {
      section.querySelector('.reveal')?.classList.add('is-visible');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertSection);
  } else {
    insertSection();
  }
})();