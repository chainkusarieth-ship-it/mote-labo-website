/* ============================================
   個別相談フォーム送信処理

   セキュリティ上の理由により、Discord Webhook URLは
   このファイルに直書きしない（ブラウザから誰でも読めるため、
   悪用・スパム送信のリスクがある）。

   FORM_ENDPOINT には、Discord Webhookへの中継のみを行う
   Cloudflare Worker のURLを設定する。
   （Cloudflareアカウント用意後にWorkerを実装し、ここに反映する）
   ============================================ */

const FORM_ENDPOINT = "https://mote-labo-discord-notify.chainkusari-eth.workers.dev";

const form = document.getElementById("consultForm");
const errorEl = document.getElementById("formError");
const successEl = document.getElementById("formSuccess");
const submitBtn = document.getElementById("submitBtn");

function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function clearError() {
  errorEl.style.display = "none";
  errorEl.textContent = "";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearError();

  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const contactType = data.get("contactType");
  const contact = (data.get("contact") || "").toString().trim();
  const plan = data.get("plan");
  const area = (data.get("area") || "").toString().trim();
  const date1 = (data.get("date1") || "").toString().trim();

  if (!name || !contactType || !contact || !area || !plan || !date1) {
    showError("必須項目が入力されていません。");
    return;
  }

  /* エリアは備考の先頭に含めて送る（既存WorkerのままでDiscordに表示されるようにするため） */
  const noteBody = (data.get("note") || "").toString().trim();
  const payload = {
    name: name,
    contactType: contactType,
    contact: contact,
    plan: plan,
    area: area,
    options: data.getAll("options"),
    date1: date1,
    date2: (data.get("date2") || "").toString().trim(),
    note: ["【お住まいのエリア】" + area, noteBody].filter(Boolean).join("\n"),
    submittedAt: new Date().toISOString()
  };

  if (!FORM_ENDPOINT) {
    // Worker未設定の段階では、実際の送信は行わずフロント動作のみ確認する
    console.warn("FORM_ENDPOINT が未設定のため、送信をスキップしました。", payload);
    form.style.display = "none";
    successEl.style.display = "block";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "送信中...";

  fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(function (res) {
      if (!res.ok) { throw new Error("送信に失敗しました。"); }
      form.style.display = "none";
      successEl.style.display = "block";
    })
    .catch(function () {
      showError("送信に失敗しました。時間をおいて再度お試しください。");
      submitBtn.disabled = false;
      submitBtn.textContent = "この内容で相談を申し込む →";
    });
});
