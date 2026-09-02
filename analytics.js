/* ============================================================
   男のモテラボ 計測スクリプト
   ------------------------------------------------------------
   何をするか
     1) GA4 のページビュー計測
     2) アフィリエイトリンクのクリック計測（どの案件が押されたか）
     3) 収益ページ・LINE登録への内部リンクのクリック計測（導線の通過率）

   使い方
     下の MEASUREMENT_ID に GA4 の測定ID（G-から始まる文字列）を入れるだけ。
     空のままなら何も送信しません。サイトの表示や動作には一切影響しません。

     測定IDの取り方：
       analytics.google.com → 管理 → データストリーム → ウェブ
       → ストリームを追加（airenmote.com）→ 表示される「測定ID」をコピー

   動作確認
     ブラウザのコンソールで  window.__moteLabDebug = true
     と入力してからリンクを押すと、送信内容がコンソールに出ます。
   ============================================================ */
(function () {
  "use strict";

  var MEASUREMENT_ID = "G-3KE97CZR22"; // 男のモテラボ サイト（GA4）

  /* ---------- GA4 の読み込み ---------- */
  if (MEASUREMENT_ID) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);
  }

  function send(name, params) {
    if (window.__moteLabDebug) { console.log("[計測]", name, params); }
    if (typeof window.gtag === "function") { window.gtag("event", name, params); }
  }

  /* ---------- 計測対象の内部リンク ---------- */
  var INTERNAL = {
    "mitame.html":       "見た目ページ",
    "deai-guide.html":   "出会いの場ページ",
    "apps.html":         "アプリページ",
    "consultation.html": "個別相談ページ",
    "diagnosis.html":    "診断ページ",
    "line-tokuten.html": "LINE特典ページ"
  };

  function classify(a) {
    var href = a.getAttribute("href") || "";
    if (/(?:a8\.net|afi-b\.com)/.test(a.href)) {
      return { event: "affiliate_click",
               label: a.getAttribute("data-aff") || "unknown" };
    }
    if (/line\.me/.test(a.href)) {
      return { event: "line_add_click", label: "LINE友だち追加" };
    }
    if (/\.pdf(\?|$)/i.test(a.href)) {
      return { event: "tokuten_pdf_click",
               label: (href.split("/").pop() || "pdf") };
    }
    if (/^#step/.test(href)) {
      return { event: "toc_click", label: href.replace("#", "") };
    }
    for (var page in INTERNAL) {
      if (href.indexOf(page) === 0 || href.indexOf("/" + page) > -1) {
        return { event: "internal_click", label: INTERNAL[page] };
      }
    }
    return null;
  }

  /* ---------- クリックを拾う ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el || typeof el.closest !== "function") { return; }
    var a = el.closest("a[href]");
    if (!a) { return; }

    var hit = classify(a);
    if (!hit) { return; }

    send(hit.event, {
      link_id:   hit.label,
      link_text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
      from_page: location.pathname.split("/").pop() || "index.html"
    });
  }, true);

  /* ---------- 診断タイプを一緒に記録する ---------- */
  try {
    var t = new URLSearchParams(location.search).get("type");
    if (t && typeof window.gtag === "function") {
      window.gtag("set", "user_properties", { shindan_type: t });
    }
  } catch (err) { /* URLSearchParams非対応ブラウザは無視 */ }
})();
