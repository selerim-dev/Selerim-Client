// Progressive enhancement only. Approval authority always stays on the server.
document.documentElement.classList.add("enhanced");
const dialog = document.querySelector(".command-dialog");
const launch = document.querySelector("[data-command]");
const openCommand = () => {
  if (!dialog.open) {
    dialog.showModal();
    document.querySelector("#command-search").focus();
  }
};
launch?.addEventListener("click", openCommand);
document
  .querySelector("[data-close]")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog?.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const items = [
    ...dialog.querySelectorAll("a,button,input:not([type=hidden])"),
  ];
  const first = items[0],
    last = items.at(-1);
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openCommand();
    return;
  }
  if (
    dialog?.open ||
    e.target.closest("input,textarea,select,[contenteditable=true]") ||
    e.metaKey ||
    e.ctrlKey ||
    e.altKey
  )
    return;
  if (e.key === "/") {
    const input = document.querySelector("#search");
    if (input) {
      e.preventDefault();
      input.focus();
    }
    return;
  }
  if (e.key === "j" || e.key === "k") {
    const rows = [...document.querySelectorAll("[data-case]")];
    const at = rows.findIndex(
      (row) => row.getAttribute("aria-current") === "true",
    );
    const next = rows[at + (e.key === "j" ? 1 : -1)];
    if (next) {
      e.preventDefault();
      window.location.assign(next.href);
    }
  }
});
const selected = document.querySelector(".queue-row.selected");
if (selected) {
  const panel = document.querySelector(".queue-scroll");
  panel.scrollLeft = Math.max(0, selected.offsetLeft - panel.offsetLeft - 16);
}
document
  .querySelector("[data-dismiss]")
  ?.addEventListener("click", (e) => e.target.closest(".toast").remove());
document.querySelectorAll("form[method=post]").forEach((form) =>
  form.addEventListener("submit", () => {
    const button = form.querySelector("button");
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  }),
);
