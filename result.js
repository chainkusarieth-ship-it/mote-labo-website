/* ============================================
   診断結果データ（タイプ別）
   diagnosis.html の script.js が決定した type を
   ?type=xxx またはlocalStorage(moteLabo_diag)から受け取り、
   このデータで結果ページを描画する。
   ============================================ */

const RESULTS = {
  gungun: {
    name: "ぐいぐい空回り型",
    catch: "好意は本物。届き方が、ほぼ事故だけど。",
    lead: "行動力は本物です。ただ、追う速度が「相手が好きになる速度」を毎回追い越しています。足りないのは勇気じゃなくて、余白です。",
    points: [
      "返信は常に秒速。相手がスマホを置く前に、次の話題が届いています",
      "3回目までに好意を全部開示。相手から「気づく楽しみ」を奪っています",
      "あなたの中では「誠実な男」。相手の画面では「通知が多い人」です"
    ],
    ren: "希少性の原理。人は、簡単に手に入るものを好きになりません。追うのをやめた日がスタートラインです。まずは既読から返信まで、相手と同じ時間をあけてみましょう。",
    app: { name: "with", reason: "性格診断ベースでマッチングするから、勢いより相性で選ばれる場に身を置ける。まず「出しすぎない練習」に向いてる。" }
  },
  bibiri: {
    name: "安全運転ビビり型",
    catch: "振られたことがないのは、告白したことがないからだけど。",
    lead: "それ、慎重じゃなくてただの停止。あなたが待っている「絶対に大丈夫なタイミング」は、過去に一度も来ていません。この先も来ません。",
    points: [
      "誘うためのLINEが下書きのまま3週間。その間に季節が変わっています",
      "「忙しいのかな」を言い訳に、自分から会話を終わらせています",
      "振られる前に諦めることを、「身の程を知ってる」と呼んでいます"
    ],
    ren: "損失回避バイアス。振られる痛みを避けた結果、「何も始まらない」という一番高いコストを毎日払っています。下書きのまま止まってるその一通、今日中に送ってください。",
    app: { name: "バチェラーデート", reason: "AIがマッチング・日程調整までお任せできる設計だから、「自分から誘う」という一番の壁を最初から迂回できる。" }
  },
  jibun: {
    name: "自分軸ズレ型",
    catch: "悪気なく、相手をずっと相槌係にしてるだけ。",
    lead: "デート後の「楽しかった」、一度でも疑ったことある？ あなたが喋って、相手が聞いて、それをあなたが「盛り上がった」と記録しているだけです。",
    points: [
      "沈黙が3秒続くと、自分の仕事の話で埋める。相手の話は思い出せません",
      "「言わなくても伝わる」と信じて、褒め言葉を一度も口にしていません",
      "デートプランは毎回「自分が行きたい店」。相手の好みを聞いた記憶がありません"
    ],
    ren: "会話はキャッチボール。あなたがやってるのは、ただの壁当てです。次のデートでは自分の話を1つ我慢して、質問を1つ増やしてみましょう。",
    app: { name: "Omiai", reason: "婚活寄りで相手の希望条件が明確に可視化される設計だから、「自分本位」を自覚しないまま進めない仕組みになっている。" }
  },
  kanchigai: {
    name: "ポジティブ勘違い型",
    catch: "その手応え、9割はあなたの脳内補正だけど。",
    lead: "都合のいい解釈で、脈ありが量産されています。ただしその脈は、相手の心臓じゃなくて、あなたの願望が打っています。",
    points: [
      "「よく目が合う」を根拠に、脳内ではもう交際3ヶ月目に入っています",
      "社交辞令の「今度メシでも」を、確定した約束としてカレンダーに登録しています",
      "うまくいかなくても「向こうにも事情がある」で処理。反省会は永遠に開かれません"
    ],
    ren: "確証バイアス。人は信じたい結論に合う証拠だけを集めます。あなたの「脈ありフォルダ」、採用基準がゆるすぎます。脈の判定は、体感じゃなくて相手の行動でしてください。",
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
