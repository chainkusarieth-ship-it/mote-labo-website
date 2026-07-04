/* ============================================
   診断結果データ（タイプ別）
   diagnosis.html の script.js が決定した type を
   ?type=xxx またはlocalStorage(moteLabo_diag)から受け取り、
   このデータで結果ページを描画する。
   ============================================ */

const RESULTS = {
  gungun: {
    name: "ぐいぐい空回り型",
    catch: "好意は本物。ただし、出し方が事故ってるだけ。",
    lead: "行動力はある。問題は「希少性」という概念が、あなたの辞書にだけ存在しないこと。",
    points: [
      "即レス・即いいねで、追いかけられる前に追いかけ切ってしまう",
      "「好き」を早々に出し切り、相手が想像する余地を残さない",
      "本人は「誠実さ」のつもりだが、相手には「圧」として届いている"
    ],
    ren: "心理学的には対人希少性の欠如。手に入りやすいものは、価値を感じにくいの。",
    app: { name: "with", reason: "性格診断ベースでマッチングするから、勢いより相性で選ばれる場に身を置ける。まず「出しすぎない練習」に向いてる。" }
  },
  bibiri: {
    name: "安全運転ビビり型",
    catch: "傷つきたくなくて、結局何も起きてないだけ。",
    lead: "慎重なんじゃなくて、止まってるだけ。あなたが待ってる「安全なタイミング」は、一生来ない。",
    points: [
      "誘い文句を下書きしたまま、数週間放置するのが日常",
      "気まずさに耐えられず、沈黙の主導権を先に手放す",
      "断られる前に自分から可能性を消して、傷を先回りで防いでいる"
    ],
    ren: "行動しない限り、失敗もしない代わりに何も起きない。それただの現状維持なの。",
    app: { name: "バチェラーデート", reason: "AIがマッチング・日程調整までお任せできる設計だから、「自分から誘う」という一番の壁を最初から迂回できる。" }
  },
  jibun: {
    name: "自分軸ズレ型",
    catch: "悪気はない。ただ、話を聞く番だと気づいてないだけ。",
    lead: "沈黙が怖いんじゃなくて、自分の話をする方が楽なだけ。相手はとっくに気づいてる。",
    points: [
      "沈黙が来ると、気づけば自分の近況・仕事の話に逃げている",
      "「態度で伝わってるはず」で、言葉にする工程を全部省略する",
      "自分の行きつけ・趣味に付き合わせる形のデートしか設計できない"
    ],
    ren: "会話はキャッチボールなの。あなたが投げてるのは、ずっと壁当てだけど。",
    app: { name: "Omiai", reason: "婚活寄りで相手の希望条件が明確に可視化される設計だから、「自分本位」を自覚しないまま進めない仕組みになっている。" }
  },
  kanchigai: {
    name: "ポジティブ勘違い型",
    catch: "その手応え、9割はあなたの脳内補正だけど。",
    lead: "都合のいい解釈で脈ありを量産するの、才能だと思う。ただし現実の成約率とは無関係。",
    points: [
      "「目が合う気がする」の時点で、もう半分付き合ってる前提で動く",
      "社交辞令の「今度メシでも」を、確定した約束としてカウントする",
      "失敗しても「タイミングが悪かっただけ」で振り返りが発生しない"
    ],
    ren: "認知的不協和を自分に都合よく解消してるだけ。心地いいけど、成長はゼロなの。",
    app: { name: "Pairs", reason: "会員数が多く「いいね」や既読の温度差が可視化されやすいから、脳内補正抜きの現実の反応と向き合う練習になる。" }
  }
};

const TYPE_KEYS = ["gungun", "bibiri", "jibun", "kanchigai"];

function getType() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("type");
  if (fromQuery && TYPE_KEYS.indexOf(fromQuery) !== -1) return fromQuery;

  try {
    const saved = JSON.parse(localStorage.getItem("moteLabo_diag") || "null");
    if (saved && TYPE_KEYS.indexOf(saved.type) !== -1) return saved.type;
  } catch (e) { /* noop */ }

  return "kanchigai";
}

function render() {
  const type = getType();
  const data = RESULTS[type];

  document.getElementById("typeName").textContent = data.name;
  document.getElementById("typeCatch").textContent = data.catch;
  document.getElementById("typeLead").textContent = data.lead;
  document.getElementById("renComment").textContent = data.ren;

  const pointsList = document.getElementById("pointsList");
  pointsList.innerHTML = "";
  data.points.forEach(function (p) {
    const li = document.createElement("li");
    li.textContent = p;
    pointsList.appendChild(li);
  });

  document.getElementById("appName").textContent = data.app.name;
  document.getElementById("appReason").textContent = data.app.reason;

  const appLink = document.getElementById("appLink");
  const url = appLink.getAttribute("data-url");
  if (url) { appLink.setAttribute("href", url); }
}

render();
