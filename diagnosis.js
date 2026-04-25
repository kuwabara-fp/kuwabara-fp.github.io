// 診断ツールのロジック
// 各テーマの質問と結果パターン、LINEメッセージ生成を管理します。
document.addEventListener('DOMContentLoaded', () => {
  // LINE公式アカウントのIDを指定します。
  const LINE_ID = '@771xcevp';

  /**
   * 各診断テーマの定義。質問はタイトルと選択肢から成り、
   * 選択肢には表示ラベル、補足説明、スコア値を含めます。
   * 結果パターンはスコアの下限(min)とタイトル、説明文、次にやることのリストです。
   */
  const themes = {
    balance: {
      name: '家計バランス診断',
      questions: [
        {
          title: '毎月の世帯収入と支出を把握していますか？',
          options: [
            { label: '把握している', desc: '収入・支出の流れを把握しています。', value: 2 },
            { label: '大まかには分かる', desc: '収支はざっくりわかる状態です。', value: 1 },
            { label: 'よく分からない', desc: 'まずは収支を把握するところから始めたいです。', value: 0 }
          ]
        },
        {
          title: '月末にお金が余ることが多いですか？',
          options: [
            { label: '余ることが多い', desc: '毎月貯蓄に回せるお金があります。', value: 2 },
            { label: 'ほぼゼロになる', desc: '貯蓄は増えないが赤字にはなりません。', value: 1 },
            { label: '足りなくなることが多い', desc: '支出が収入を上回る月があります。', value: 0 }
          ]
        },
        {
          title: '生活防衛資金（急な出費に備えた貯蓄）が3か月分以上ありますか？',
          options: [
            { label: '3か月分以上ある', desc: '十分な緊急予備資金があります。', value: 2 },
            { label: '1〜2か月分', desc: '少しだけ備えがあります。', value: 1 },
            { label: 'ほとんどない', desc: '急な出費に備える貯蓄がありません。', value: 0 }
          ]
        },
        {
          title: 'クレジットカードやローンの残債が気になるほどありますか？',
          options: [
            { label: 'ほとんどない', desc: '借入残高が少ない状態です。', value: 2 },
            { label: '少し気になる', desc: '返済計画を確認したい状態です。', value: 1 },
            { label: 'とても気になる', desc: '借入が負担になっています。', value: 0 }
          ]
        },
        {
          title: '支出の内訳を定期的に見直していますか？',
          options: [
            { label: '見直している', desc: '支出の把握と改善を定期的に行っています。', value: 2 },
            { label: 'ときどき見直す', desc: 'ときどき支出の確認をしています。', value: 1 },
            { label: 'ほとんど見ない', desc: '支出の振り返りはほとんどしていません。', value: 0 }
          ]
        }
      ],
      results: [
        {
          min: 8,
          title: '家計バランスが良好なタイプです',
          copy: '収支や貯蓄の把握ができており、家計のバランスが比較的安定しています。今後は資産形成や教育費など長期の計画に力を入れるとさらに安心です。',
          next: [
            'ライフプラン全体を見渡し、教育費や老後資金を細かく試算する',
            '余裕資金をNISAなどの運用に回す',
            '家族の将来の目標を共有し、貯蓄の目的を確認する'
          ]
        },
        {
          min: 4,
          title: '課題と余地があるタイプです',
          copy: 'ある程度の把握はできていますが、貯蓄や支出の管理に改善余地があります。固定費の見直しや先取り貯蓄を意識するとバランスが整いやすくなります。',
          next: [
            '毎月の固定費をチェックし、減らせる項目がないか検討する',
            '給与天引きや自動振替など、先取り貯蓄の仕組みを導入する',
            'ローンやカード残高の整理を行い、返済計画を立てる'
          ]
        },
        {
          min: 0,
          title: '家計の土台作りから始めるタイプです',
          copy: '今は家計の流れをつかみにくい状態かもしれません。まずは収支の記録や、貯蓄の目安を決めるところから一緒に考えましょう。',
          next: [
            '収入と支出を1か月記録し、現状を把握する',
            '最低3か月分の生活費を目標に貯蓄を始める',
            'カード残高やローンなど借入の一覧を作成する'
          ]
        }
      ]
    },
    education: {
      name: '教育資金診断',
      questions: [
        {
          title: 'お子さまにかかる教育費の総額を概算したことがありますか？',
          options: [
            { label: 'ある', desc: '必要額の大まかな目安を把握しています。', value: 2 },
            { label: 'なんとなくある', desc: '教育費がかかることは分かるが、具体額は未整理です。', value: 1 },
            { label: 'ない', desc: '教育費の試算をこれから行いたいです。', value: 0 }
          ]
        },
        {
          title: '教育費専用の貯蓄や運用をしていますか？',
          options: [
            { label: 'している', desc: 'つみたてNISAや学資保険などを活用しています。', value: 2 },
            { label: '一部している', desc: '定期預金や積立を少し行っています。', value: 1 },
            { label: 'していない', desc: 'まだ準備を始めていません。', value: 0 }
          ]
        },
        {
          title: '児童手当やボーナスを教育費に充てる割合を決めていますか？',
          options: [
            { label: '決めている', desc: '教育費に回す割合や目的が決まっています。', value: 2 },
            { label: '一部決めている', desc: '一部は教育費に充てるが、明確な割合ではありません。', value: 1 },
            { label: '決めていない', desc: '使い道は毎回考えて決めています。', value: 0 }
          ]
        },
        {
          title: '教育費以外の支出（住宅や老後資金）とのバランスを考えていますか？',
          options: [
            { label: '考えている', desc: '家計の中でバランスを取るように意識しています。', value: 2 },
            { label: '少し考えている', desc: '気にはしているが、具体的に整理できていません。', value: 1 },
            { label: '考えていない', desc: '教育費だけでも手いっぱいです。', value: 0 }
          ]
        },
        {
          title: 'お子さまの進路や教育方針について家族で話し合ったことがありますか？',
          options: [
            { label: 'ある', desc: '進路や方針について共有できています。', value: 2 },
            { label: '少しある', desc: '断片的には話している状態です。', value: 1 },
            { label: 'ない', desc: 'これから話し合いたいと考えています。', value: 0 }
          ]
        }
      ],
      results: [
        {
          min: 8,
          title: '教育費の準備が進んでいるタイプです',
          copy: '教育費を意識した貯蓄や情報収集ができています。進路の選択肢と費用の差をさらに具体的に試算すると安心感が増します。',
          next: [
            '公立・私立など進路別に必要額を試算する',
            '定期的に積立額を見直し、増額できるか確認する',
            '奨学金や補助制度について事前に情報を集める'
          ]
        },
        {
          min: 4,
          title: 'あと少し整えるタイプです',
          copy: '教育費を意識していますが、積立額や準備方法が曖昧かもしれません。必要額を試算し、児童手当やボーナスの使い方を定めると整います。',
          next: [
            '児童手当やボーナスから教育費に回す割合を決める',
            '教育費専用の口座や運用方法を確立する',
            '家族で教育にかけたい費用や価値観を話し合う'
          ]
        },
        {
          min: 0,
          title: '基礎から始めるタイプです',
          copy: '教育費の具体的な目安がまだつかめていない状態です。学校ごとの費用や利用できる制度を知り、今できる小さな積立から始めましょう。',
          next: [
            '教育費の目安や制度を調べ、情報を集める',
            '毎月少額でも教育費専用の積立を始める',
            '家計全体の収支を見直し、教育費の優先順位を確認する'
          ]
        }
      ]
    },
    future: {
      name: '将来資金診断',
      questions: [
        {
          title: '老後に必要な生活費の目安を把握していますか？',
          options: [
            { label: '把握している', desc: '退職後に必要な金額を概算しています。', value: 2 },
            { label: 'なんとなく', desc: '将来に不安はあるが具体的な額は未整理です。', value: 1 },
            { label: '把握していない', desc: '老後資金はこれから考えたいです。', value: 0 }
          ]
        },
        {
          title: 'iDeCoやNISAなど長期投資を活用していますか？',
          options: [
            { label: '活用している', desc: '積立NISAやiDeCoなどを継続しています。', value: 2 },
            { label: '少し活用している', desc: '少額の投資や保険を利用しています。', value: 1 },
            { label: '活用していない', desc: 'ほとんど預貯金のみです。', value: 0 }
          ]
        },
        {
          title: '住宅ローンの返済完了時期を把握していますか？',
          options: [
            { label: '把握している', desc: '完済時期や残高を把握しています。', value: 2 },
            { label: 'なんとなく', desc: 'だいたいの時期は分かっています。', value: 1 },
            { label: '把握していない', desc: 'ローン返済計画を見直したいです。', value: 0 }
          ]
        },
        {
          title: '万が一の際に家族を守る保障（生命保険や就業不能保障）が十分だと感じますか？',
          options: [
            { label: '十分だと感じる', desc: '必要な保険や保障を備えています。', value: 2 },
            { label: '少し不安', desc: '保障内容を確認・見直ししたいです。', value: 1 },
            { label: '不足していると感じる', desc: '保障内容が不十分だと思います。', value: 0 }
          ]
        },
        {
          title: 'ご夫婦で将来の資金計画を定期的に話し合っていますか？',
          options: [
            { label: '定期的に話し合っている', desc: '年に数回は家計の見直しをしています。', value: 2 },
            { label: 'たまに話している', desc: '時間がある時だけ話題にしています。', value: 1 },
            { label: 'ほとんど話していない', desc: 'これから一緒に整理したいです。', value: 0 }
          ]
        }
      ],
      results: [
        {
          min: 8,
          title: '将来資金の準備が進んでいるタイプです',
          copy: '老後資金やリスクへの備えが意識され、長期投資や保険の活用も進んでいます。時々家計全体を見直し、変化に応じて調整するとさらに良いでしょう。',
          next: [
            '定期的に家計や資産を振り返り、目標額との差を確認する',
            '金利や運用商品の見直しを行い、長期投資の効率を高める',
            '住宅ローンや保険の見直し時期を決めておく'
          ]
        },
        {
          min: 4,
          title: 'あと一歩で安心タイプです',
          copy: '将来資金への意識はありますが、投資や保険など部分的に抜けがあるかもしれません。必要額の試算と対策のバランスを確認しましょう。',
          next: [
            '老後に必要な生活費と収入源を試算する',
            'iDeCoや積立NISAの拠出額を見直し、増額を検討する',
            '生命保険や医療保険の内容を確認し、必要な保障を検討する'
          ]
        },
        {
          min: 0,
          title: 'これから準備を始めるタイプです',
          copy: '将来資金の見通しがまだ明確ではない状態です。老後に必要な生活費を試算し、iDeCoや積立NISAなど小さく始められる制度を検討しましょう。',
          next: [
            '公的年金や退職金の見込額を調べる',
            '月々の貯蓄や投資の目標額を設定する',
            '保険や住宅ローンの残高を整理し、返済計画を立てる'
          ]
        }
      ]
    }
  };

  // DOM要素の参照を取得します
  const selectionSection = document.getElementById('selection-section');
  const questionsSection = document.getElementById('questions-section');
  const resultSection = document.getElementById('result-section');
  const questionsContainer = document.getElementById('questions-container');
  const form = document.getElementById('diagnosis-form');
  const resetButton = document.getElementById('diagnosis-reset');
  const restartButton = document.getElementById('restart-btn');
  const copyMemoBtn = document.getElementById('copy-memo-btn');
  const lineLink = document.getElementById('line-link');

  let currentTheme = null;
  let maxScore = 0;
  let memoMessage = '';

  // テーマ選択ボタンにイベントリスナーを付与
  document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const themeId = btn.getAttribute('data-theme');
      currentTheme = themes[themeId];
      if (!currentTheme) {
        return;
      }
      // 質問カードを生成
      questionsContainer.innerHTML = '';
      currentTheme.questions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        const title = document.createElement('h2');
        title.className = 'question-title';
        title.textContent = `Q${idx + 1}. ${q.title}`;
        card.appendChild(title);
        const group = document.createElement('div');
        group.className = 'radio-group';
        q.options.forEach((opt) => {
          const label = document.createElement('label');
          label.className = 'radio-option';
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `q${idx + 1}`;
          input.value = opt.value;
          const optionDiv = document.createElement('div');
          const strong = document.createElement('strong');
          strong.textContent = opt.label;
          const span = document.createElement('span');
          span.textContent = opt.desc;
          optionDiv.appendChild(strong);
          optionDiv.appendChild(span);
          label.appendChild(input);
          label.appendChild(optionDiv);
          group.appendChild(label);
        });
        card.appendChild(group);
        questionsContainer.appendChild(card);
      });
      maxScore = currentTheme.questions.length * 2;
      // セクションの表示切替
      selectionSection.style.display = 'none';
      questionsSection.style.display = 'block';
      resultSection.style.display = 'none';
      resultSection.classList.add('result-hidden');
    });
  });

  // フォーム送信時の処理
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentTheme) {
      return;
    }
    // 回答の取得
    const answers = [];
    let hasEmpty = false;
    currentTheme.questions.forEach((q, idx) => {
      const checked = form.querySelector(`input[name="q${idx + 1}"]:checked`);
      if (!checked) {
        hasEmpty = true;
      } else {
        answers.push(Number(checked.value));
      }
    });
    if (hasEmpty) {
      alert('すべての質問に回答してください。');
      return;
    }
    const total = answers.reduce((sum, val) => sum + val, 0);
    // 結果のパターンを判定
    let matched = null;
    for (const pattern of currentTheme.results) {
      if (total >= pattern.min) {
        matched = pattern;
        break;
      }
    }
    if (!matched) {
      matched = currentTheme.results[currentTheme.results.length - 1];
    }
    // 結果の表示を更新
    document.getElementById('diag-result-title').textContent = matched.title;
    document.getElementById('diag-result-copy').textContent = matched.copy;
    const nextList = document.getElementById('diag-result-next');
    nextList.innerHTML = '';
    matched.next.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      nextList.appendChild(li);
    });
    // 相談メモの作成
    memoMessage = `【${currentTheme.name}】診断結果：${total}/${maxScore}点　${matched.title}\n${matched.copy}\n${matched.next.map((t) => '- ' + t).join('\n')}\n\n今の状況に合った改善方法を相談したいです。`;
    // LINEリンクを更新
    const encoded = encodeURIComponent(memoMessage);
    lineLink.href = `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID)}/?${encoded}`;
    // コピー機能
    copyMemoBtn.onclick = () => {
      navigator.clipboard.writeText(memoMessage).then(() => {
        alert('相談メモをコピーしました。LINEに貼り付けてご利用ください。');
      }).catch(() => {
        alert('コピーに失敗しました。手動でコピーしてください。');
      });
    };
    // セクションの表示切替
    questionsSection.style.display = 'none';
    resultSection.style.display = 'block';
    resultSection.classList.remove('result-hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // やり直しボタン
  resetButton.addEventListener('click', () => {
    form.reset();
    selectionSection.style.display = 'block';
    questionsSection.style.display = 'none';
    resultSection.style.display = 'none';
    currentTheme = null;
  });

  // 最初からやり直すボタン
  restartButton.addEventListener('click', () => {
    form.reset();
    selectionSection.style.display = 'block';
    questionsSection.style.display = 'none';
    resultSection.style.display = 'none';
    currentTheme = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});