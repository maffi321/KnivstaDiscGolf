(function () {
  const config = window.SITE_CONFIG && window.SITE_CONFIG.news;
  const listEl = document.getElementById("news-list");
  const detailEl = document.getElementById("news-detail");

  if (!config || !config.sheetId || (!listEl && !detailEl)) {
    return;
  }

  const sheetName = encodeURIComponent(config.sheetName || "Sheet1");
  const url =
    "https://docs.google.com/spreadsheets/d/" +
    config.sheetId +
    "/gviz/tq?tqx=out:json&sheet=" +
    sheetName;

  const cacheBuster = "cb=" + Date.now();
  loadViaScript(url + "&" + cacheBuster, processResponse, handleError);

  function processResponse(response) {
    const items = tableToItems((response && response.table) || {});

    if (detailEl) {
      renderDetail(detailEl, items);
    } else if (listEl) {
      renderList(listEl, items, config.maxItems);
    }
  }

  function handleError() {
    if (listEl) {
      listEl.innerHTML = "<p class=\"news-empty\">Inga nyheter just nu.</p>";
    }
    if (detailEl) {
      detailEl.innerHTML =
        "<p class=\"news-empty\">Vi hittar inte denna nyhet just nu.</p>";
    }
  }

  function loadViaScript(src, onSuccess, onError) {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      cleanup();
      onError();
    }, 8000);

    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};

    const previous = window.google.visualization.Query.setResponse;

    window.google.visualization.Query.setResponse = function (response) {
      cleanup();
      if (previous) {
        window.google.visualization.Query.setResponse = previous;
      }
      onSuccess(response);
    };

    script.src = src;
    script.onerror = () => {
      cleanup();
      if (previous) {
        window.google.visualization.Query.setResponse = previous;
      }
      onError();
    };

    document.head.appendChild(script);

    function cleanup() {
      window.clearTimeout(timeout);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
  }

  function tableToItems(table) {
    const rawCols = (table.cols || []).map((col) => normalizeKey(col.label || ""));
    let rows = table.rows || [];
    let cols = rawCols;

    if (!rawCols.some((label) => label) && rows.length) {
      const headerRow = rows[0].c || [];
      cols = headerRow.map((cell) => normalizeKey(cellValue(cell)));
      rows = rows.slice(1);
    }

    return rows
      .map((row) => {
        const item = {};
        cols.forEach((key, index) => {
          if (!key) {
            return;
          }
          const canonical = keyMap[key] || key;
          item[canonical] = cellValue(row.c && row.c[index]);
        });
        return normalizeItem(item);
      })
      .filter((item) => item.title);
  }

  function cellValue(cell) {
    if (!cell) {
      return "";
    }
    if (typeof cell.f === "string") {
      return cell.f.trim();
    }
    if (cell.v === null || cell.v === undefined) {
      return "";
    }
    if (typeof cell.v === "string") {
      return cell.v.trim();
    }
    return String(cell.v);
  }

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function normalizeKey(label) {
    const text = label
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o");

    return text;
  }

  const keyMap = {
    id: "id",
    slug: "id",
    identifier: "id",
    date: "date",
    datum: "date",
    title: "title",
    rubrik: "title",
    titel: "title",
    summary: "summary",
    sammanfattning: "summary",
    sammandrag: "summary",
    body: "body",
    text: "body",
    innehall: "body",
    beskrivning: "body",
    link: "link",
    lank: "link",
    url: "link",
  };

  function normalizeItem(item) {
    return {
      id: item.id || "",
      date: item.date || "",
      title: item.title || "",
      summary: item.summary || "",
      body: item.body || item.summary || "",
      link: item.link || "",
    };
  }

  function escapeHtml(value) {
    const text = value ? String(value) : "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderList(target, items, maxItems) {
    const sliced = typeof maxItems === "number" ? items.slice(0, maxItems) : items;

    if (!sliced.length) {
      target.innerHTML = "<p class=\"news-empty\">Inga nyheter just nu.</p>";
      return;
    }

    target.innerHTML = sliced
      .map((item) => {
        const id = item.id || slugify(item.title);
        const link = item.link || ("news.html?id=" + encodeURIComponent(id));
        const summary = item.summary || item.body || "";
        const meta = item.date ? "<span>" + escapeHtml(item.date) + "</span>" : "";
        const safeTitle = escapeHtml(item.title);
        const safeSummary = escapeHtml(summary);
        const safeLink = escapeHtml(link);

        return (
          "<article class=\"news-item\">" +
          "<div class=\"news-meta\">" +
          meta +
          "</div>" +
          "<h3 class=\"news-title\">" +
          safeTitle +
          "</h3>" +
          "<p class=\"news-summary\">" +
          safeSummary +
          "</p>" +
          "<a class=\"news-link\" href=\"" +
          safeLink +
          "\">Läs mer</a>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderDetail(target, items) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      target.innerHTML =
        "<p class=\"news-empty\">Välj en nyhet från startsidan.</p>";
      return;
    }

    const match = items.find((item) => (item.id || slugify(item.title)) === id);

    if (!match) {
      target.innerHTML =
        "<p class=\"news-empty\">Vi hittar inte denna nyhet just nu.</p>";
      return;
    }

    const body = match.body || match.summary || "";
    const safeBody = escapeHtml(body).replace(/\n/g, "<br>");
    const meta = match.date ? "<span>" + escapeHtml(match.date) + "</span>" : "";
    const safeTitle = escapeHtml(match.title);
    const source =
      match.link && match.link !== ""
        ? "<p><a class=\"news-link\" href=\"" +
          escapeHtml(match.link) +
          "\" target=\"_blank\" rel=\"noopener noreferrer\">Läs original</a></p>"
        : "";

    target.innerHTML =
      "<div class=\"news-meta\">" +
      meta +
      "</div>" +
      "<h1 class=\"news-detail-title\">" +
      safeTitle +
      "</h1>" +
      "<p class=\"news-detail-body\">" +
      safeBody +
      "</p>" +
      source;
  }
})();
