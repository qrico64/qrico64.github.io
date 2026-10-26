/* Progressive enhancement: content and navigation work without JavaScript. */
(() => {
  const tabList = document.querySelector(".tabs");
  const tabs = [...tabList.querySelectorAll(".tab")];
  const panels = tabs.map((tab) => document.querySelector(tab.getAttribute("href")));
  const paperPreviews = [...document.querySelectorAll(".paper-preview video")];

  function syncPaperPreviews() {
    paperPreviews.forEach((video) => {
      if (document.hidden || video.closest(".panel").hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    });
  }

  function targetFromHash() {
    try {
      return document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      return null;
    }
  }

  function showPanel(panel, focusTab = false) {
    panels.forEach((candidate, index) => {
      const selected = candidate === panel;
      candidate.hidden = !selected;
      tabs[index].setAttribute("aria-selected", String(selected));
      tabs[index].tabIndex = selected ? 0 : -1;
      if (!selected) {
        candidate.querySelectorAll("video").forEach((video) => video.pause());
      }
    });
    syncPaperPreviews();
    if (focusTab) tabs[panels.indexOf(panel)].focus({ preventScroll: true });
  }

  function syncFromLocation() {
    const target = targetFromHash();
    const panel = panels.find((candidate) => candidate === target || candidate.contains(target));
    const current = panels.find((candidate, index) => tabs[index].getAttribute("aria-selected") === "true");
    // A link to the main content (the skip link) keeps the current tab open.
    showPanel(panel || (target ? current : null) || panels[0]);
    // Reveal a paper or demo before scrolling to a cross-tab link's target.
    if (panel && target !== panel) {
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }
  }

  function activateTab(index) {
    const panel = panels[index];
    if (location.hash !== `#${panel.id}`) {
      history.pushState(null, "", `#${panel.id}`);
    }
    // Switching tabs preserves the current scroll position.
    showPanel(panel, true);
  }

  tabList.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    const panel = panels[index];
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;

    tab.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activateTab(index);
    });
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        activateTab(nextIndex);
      }
      // Space activates anchor-based tabs just as it does button-based tabs.
      if (event.key === " ") {
        event.preventDefault();
        activateTab(index);
      }
    });
  });

  window.addEventListener("hashchange", syncFromLocation);
  window.addEventListener("popstate", syncFromLocation);
  syncFromLocation();

  // Pause clips in background browser tabs as well as hidden site panels.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) document.querySelectorAll("video").forEach((video) => video.pause());
    else syncPaperPreviews();
  });
  document.getElementById("current-year").textContent = new Date().getFullYear();
})();
