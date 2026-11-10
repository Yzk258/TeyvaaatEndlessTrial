const tabList = document.querySelector('.gallery-tabs');
const tabs = Array.from(tabList.querySelectorAll('button'));
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

function showPreview(index) {
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[tabIndex].hidden = !selected;
  });
}

tabList.setAttribute('role', 'tablist');
tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab');
  panels[index].setAttribute('role', 'tabpanel');
  tab.addEventListener('click', () => showPreview(index));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    switch (event.key) {
      case 'ArrowLeft': nextIndex = (index - 1 + tabs.length) % tabs.length; break;
      case 'ArrowRight': nextIndex = (index + 1) % tabs.length; break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    showPreview(nextIndex);
    tabs[nextIndex].focus();
  });
});
showPreview(0);
tabList.hidden = false;
