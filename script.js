/* ============================================
   非モテタイプ診断ロジック（フロントのみで完結）
   タイプ:
     gungun    … ぐいぐい空回り型（好意を出しすぎ・希少性ゼロ）
     bibiri    … 安全運転ビビり型（受け身・踏み込めない）
     jibun     … 自分軸ズレ型（自分の話・空気を読まない）
     kanchigai … ポジティブ勘違い型（脈を都合よく解釈）
   各設問の選択肢が上記いずれかに加点。最多得点タイプを結果に。
   ============================================ */

const QUESTIONS = [
  {
    ren: "正直に選んで。カッコつけた回答は、全部ノイズになるだけ。",
    q: "気になる人ができた。最初の1週間、実際やってるのは？",
    choices: [
      { t: "gungun",    label: "即SNSをフォローして、投稿全部にいいねをつけにいく" },
      { t: "bibiri",    label: "嫌われたら終わるから、まず1ヶ月かけて様子を見る" },
      { t: "jibun",     label: "興味を持ってもらおうと、自分の得意な話を仕込んでおく" },
      { t: "kanchigai", label: "よく目が合う気がするし、正直もう半分付き合えてると思う" }
    ]
  },
  {
    ren: "LINEは性格のレントゲンなの。ごまかしても写るよ。",
    q: "気になる人とのLINE、一番実態に近いのは？",
    choices: [
      { t: "gungun",    label: "通知が来たら3分以内に返す。既読スルーは絶対しない" },
      { t: "bibiri",    label: "1通に30分かける。送ったあとも何度も読み返して後悔する" },
      { t: "jibun",     label: "聞かれてもいない自分の近況を、長文で送ってしまう" },
      { t: "kanchigai", label: "即レスが続いてる時点で、向こうも俺に夢中だと思う" }
    ]
  },
  {
    ren: "会話はキャッチボールって言うけど、あなたのは壁当てだけど。",
    q: "デート中の会話、正直どうなってる？",
    choices: [
      { t: "jibun",     label: "沈黙が怖くて、気づけば自分の仕事の話を15分してる" },
      { t: "bibiri",    label: "「うんうん」「わかる」だけで2時間。質問が出てこない" },
      { t: "gungun",    label: "かわいい・すごい・面白い、を機械みたいに連発してる" },
      { t: "kanchigai", label: "相手が笑ってた＝大成功、と疑ったことがない" }
    ]
  },
  {
    ren: "沈黙の3秒のさばき方に、恋愛偏差値って全部出るの。",
    q: "会話が途切れて沈黙。最初にやってしまうのは？",
    choices: [
      { t: "bibiri",    label: "気まずさに耐えられず、意味もなくスマホを見る" },
      { t: "gungun",    label: "「休みの日何してるの？」って面接みたいな質問を再開する" },
      { t: "jibun",     label: "特に気にしない。黙ったまま自分の食事に集中する" },
      { t: "kanchigai", label: "「沈黙が心地いい関係になったんだな」と解釈する" }
    ]
  },
  {
    ren: "外見の話。「中身を見て」は、書類選考を通ってから言うセリフなの。",
    q: "服・髪・清潔感。外見への投資、正直なところは？",
    choices: [
      { t: "jibun",     label: "ほぼ現状維持。中身で選んでくれる人がいいと思ってる" },
      { t: "bibiri",    label: "変に思われるのが怖くて、結局いつも無難な全身黒" },
      { t: "gungun",    label: "デート前だけ急に気合いが入る。香水はつけすぎがち" },
      { t: "kanchigai", label: "平均よりは上だと思ってるから、特に変える気はない" }
    ]
  },
  {
    ren: "好意の扱い方。非モテの事故の9割、ここで起きてるから。",
    q: "「好き」という気持ち、実際どう扱ってる？",
    choices: [
      { t: "gungun",    label: "2回目のデートで好意全開。駆け引きとか無理なんで" },
      { t: "bibiri",    label: "バレたら終わる気がして、逆に素っ気なくしてしまう" },
      { t: "jibun",     label: "態度で伝わってるはず。わざわざ言葉にはしない" },
      { t: "kanchigai", label: "向こうも好きなのは確定だから、告白はいつでもできる" }
    ]
  },
  {
    ren: "誘い方は戦略なの。当たって砕けろは、ただの遭難だけど。",
    q: "食事やデート、実際どうやって誘ってる？",
    choices: [
      { t: "bibiri",    label: "誘い文句を下書きしたまま、送れずに数週間が経つ" },
      { t: "gungun",    label: "断られても「じゃあ再来週は？」と、すぐ次の日程を出す" },
      { t: "jibun",     label: "自分の行きつけの店や趣味のイベントに付き合わせる形" },
      { t: "kanchigai", label: "「今度メシでも」の社交辞令を、約束としてカウントしてる" }
    ]
  },
  {
    ren: "最後。失敗したときの言い訳に、伸びしろが全部出るの。",
    q: "アプローチが失敗した。真っ先に頭に浮かぶのは？",
    choices: [
      { t: "kanchigai", label: "タイミングが悪かっただけで、俺自身は悪くない" },
      { t: "bibiri",    label: "やっぱり俺なんかじゃ無理だった、と1ヶ月引きずる" },
      { t: "jibun",     label: "俺の良さが伝わらない相手なら、縁がなかっただけ" },
      { t: "gungun",    label: "押しが足りなかった。次はもっとグイグイいこう" }
    ]
  }
];

// タイプごとの結果ページ遷移用キー（result.html 側でこのキーを受け取る想定）
const TYPE_KEYS = ["gungun", "bibiri", "jibun", "kanchigai"];

const state = {
  index: 0,
  answers: [],          // 各設問で選ばれた type
  scores: { gungun: 0, bibiri: 0, jibun: 0, kanchigai: 0 }
};

const el = {
  fill: document.getElementById("progressFill"),
  cur: document.getElementById("qCurrent"),
  total: document.getElementById("qTotal"),
  renNav: document.getElementById("renNav"),
  qNum: document.getElementById("qNum"),
  qText: document.getElementById("qText"),
  choiceList: document.getElementById("choiceList"),
  qCard: document.getElementById("qCard"),
  backBtn: document.getElementById("backBtn"),
  controls: document.querySelector(".diag-controls"),
  finish: document.getElementById("finishScreen")
};

el.total.textContent = QUESTIONS.length;

function render() {
  const n = state.index;
  const item = QUESTIONS[n];

  el.fill.style.width = ((n) / QUESTIONS.length * 100) + "%";
  el.cur.textContent = n + 1;
  el.renNav.textContent = item.ren;
  el.qNum.textContent = "QUESTION " + (n + 1);
  el.qText.textContent = item.q;
  el.backBtn.style.visibility = n === 0 ? "hidden" : "visible";

  el.choiceList.innerHTML = "";
  const keys = ["A", "B", "C", "D"];
  item.choices.forEach(function (c, i) {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    if (state.answers[n] && state.answers[n] === c.t + "#" + i) {
      btn.classList.add("selected");
    }
    btn.innerHTML = '<span class="key">' + keys[i] + '</span><span>' + c.label + '</span>';
    btn.addEventListener("click", function () { select(n, c.t, i); });
    el.choiceList.appendChild(btn);
  });
}

function select(n, type, choiceIndex) {
  // 既存回答があればスコアを巻き戻し
  if (state.answers[n]) {
    const prevType = state.answers[n].split("#")[0];
    state.scores[prevType]--;
  }
  state.scores[type]++;
  state.answers[n] = type + "#" + choiceIndex;

  // 選択を視覚反映してから次へ
  const btns = el.choiceList.querySelectorAll(".choice-btn");
  btns.forEach(function (b) { b.classList.remove("selected"); });
  btns[choiceIndex].classList.add("selected");

  setTimeout(function () {
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finish();
    }
  }, 260);
}

el.backBtn.addEventListener("click", function () {
  if (state.index > 0) {
    state.index--;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function decideType() {
  let best = TYPE_KEYS[0];
  let max = -1;
  // 同点時はタイスブレーク（回答が新しいものを優先せず、定義順の安定判定）
  TYPE_KEYS.forEach(function (k) {
    if (state.scores[k] > max) { max = state.scores[k]; best = k; }
  });
  return best;
}

function finish() {
  el.fill.style.width = "100%";
  el.cur.textContent = QUESTIONS.length;
  el.qCard.style.display = "none";
  el.controls.style.display = "none";
  el.finish.style.display = "block";

  const type = decideType();

  // 結果を保存（result.html 側で参照可能にしておく）
  try {
    localStorage.setItem("moteLabo_diag", JSON.stringify({
      type: type,
      scores: state.scores,
      answeredAt: new Date().toISOString()
    }));
  } catch (e) { /* localStorage 不可でも遷移は継続 */ }

  // 結果ページは別タスクで実装予定。type をクエリで渡して遷移。
  setTimeout(function () {
    window.location.href = "result.html?type=" + encodeURIComponent(type);
  }, 1600);
}

render();
