import { BaseView } from './BaseView.js';

export class FetcherView extends BaseView {
  constructor({ onFetchRequest }) {
    super('results');
    this.onFetchRequest = onFetchRequest;
    this.urlsInput = document.getElementById('urlsInput');
    this.concurrencyInput = document.getElementById('concurrencyInput');
    this.fetchButton = document.getElementById('fetchButton');
    this._wire();
  }
  _wire() {
    const handler = () => {
      const urls = this.urlsInput.value.split(',').map(u => u.trim()).filter(Boolean);
      const maxConcurrency = parseInt(this.concurrencyInput.value, 10);
      this.onFetchRequest(urls, maxConcurrency);
    };
    this.addActivation(this.fetchButton, handler);
    this.addEnterHandler(this.urlsInput, handler);
    this.addEnterHandler(this.concurrencyInput, handler);
  }
  displayResults(responses) {
    this.resultsContainer.innerHTML = '';
    responses.forEach((res, i) => {
      const div = document.createElement('div');
      div.className = 'mb-4 p-4 rounded-lg border break-words ' + (res.status === 'fulfilled'
        ? 'bg-green-100 border-green-300 text-green-800'
        : 'bg-red-100 border-red-300 text-red-800');
      div.innerHTML = res.status === 'fulfilled'
        ? `<p class="font-bold">URL #${i + 1}</p>
           <p class="text-sm">URL: ${res.url}</p>
           <pre class="mt-2 text-xs overflow-x-auto">${JSON.stringify(res.value, null, 2)}</pre>`
        : `<p class="font-bold">URL #${i + 1}</p>
           <p class="text-sm">URL: ${res.url}</p>
           <p class="mt-2">Status: <span class="font-semibold">Error</span></p>
           <p class="mt-1">Reason: ${res.reason.message}</p>`;
      this.resultsContainer.appendChild(div);
    });
  }
}
