export class BaseView {
  constructor(resultsContainerId = 'results') { this.resultsContainer = document.getElementById(resultsContainerId); }
  displayMessage(message, isError = false) {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = '';
    const div = document.createElement('div');
    div.className = `p-4 rounded-lg font-semibold text-center ${isError ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`;
    div.textContent = message;
    this.resultsContainer.appendChild(div);
  }
  addActivation(element, handler) {
    if (!element) return;
    element.addEventListener('click', handler);
    element.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); } });
  }
  addEnterHandler(element, handler) {
    if (!element) return;
    element.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handler(e);
      }
    });
  }
}
