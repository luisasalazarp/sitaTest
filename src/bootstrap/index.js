/** Composition root wiring use cases to UI views */
import { ConcurrencyFetcher } from '../domain/services/ConcurrencyFetcher.js';
import { FetchUrlsUseCase } from '../application/useCases/FetchUrlsUseCase.js';
import { LicensePlateGenerator } from '../domain/services/LicensePlateGenerator.js';
import { LicensePlateUseCase } from '../application/useCases/LicensePlateUseCase.js';
import { FetcherView } from '../infrastructure/ui/FetcherView.js';
import { LicensePlateView } from '../infrastructure/ui/LicensePlateView.js';

document.addEventListener('DOMContentLoaded', () => {
  const fetchUrlsUseCase = new FetchUrlsUseCase(new ConcurrencyFetcher());
  const licensePlateUseCase = new LicensePlateUseCase(new LicensePlateGenerator());

  let fetcherView = null;
  let licenseView = null;

  const fetcherButton = document.getElementById('fetcherButton');
  const licenseButton = document.getElementById('licenseButton');
  const fetcherFields = document.getElementById('fetcherFields');
  const licenseFields = document.getElementById('licenseFields');
  const resultsContainer = document.getElementById('resultsContainer');
  const results = document.getElementById('results');
  const instruction = document.getElementById('instructionText');
  const setInstruction = (text) => {
    if (!instruction) return;
    // If first time, just set and fade in
    if (!instruction.textContent) {
      instruction.textContent = text;
      instruction.classList.remove('instruction-hidden');
      instruction.classList.add('instruction-visible');
      return;
    }
    if (instruction.textContent === text) return; // No change
    // Fade out then change
    instruction.classList.remove('instruction-visible');
    instruction.classList.add('instruction-hidden');
    setTimeout(() => {
      instruction.textContent = text;
      instruction.classList.remove('instruction-hidden');
      instruction.classList.add('instruction-visible');
    }, 220); // slightly less than transition for smoother experience
  };

  const resetButtons = (selected) => {
    const mapping = [
      { btn: fetcherButton, active: 'bg-blue-500 custom-hover-blue ring ring-blue-400', base: 'bg-gray-400' },
      { btn: licenseButton, active: 'bg-green-500 custom-hover-green ring ring-green-400', base: 'bg-gray-400' }
    ];
    mapping.forEach(({ btn, active, base }) => {
      btn.classList.remove('bg-blue-500', 'bg-green-500', 'bg-gray-400', 'ring', 'ring-blue-400', 'ring-green-400');
      btn.classList.remove('hover:bg-blue-700', 'hover:bg-green-700');
      btn.classList.remove('custom-hover-blue', 'custom-hover-green');
      if (btn === selected) {
        active.split(' ').forEach(c => btn.classList.add(c));
      } else {
        btn.classList.add(base);
      }
    });
  };

  const clearResults = () => { if (results) results.innerHTML = '<p class="text-gray-500">Ready.</p>'; };

  const showFetcher = () => {
    fetcherFields.style.display = '';
    licenseFields.style.display = 'none';
    resultsContainer.style.display = '';
    setInstruction('Enter a list of URLs and a concurrency limit.');
    resetButtons(fetcherButton);
    clearResults();
    if (!fetcherView) {
      fetcherView = new FetcherView({
        onFetchRequest: async (urls, maxConcurrency) => {
          fetcherView.displayMessage('Starting requests...');
          try {
            const responses = await fetchUrlsUseCase.execute(urls, maxConcurrency);
            fetcherView.displayResults(responses);
          } catch (e) { fetcherView.displayMessage(e.message, true); }
        }
      });
    }
  };

  const showLicense = () => {
    fetcherFields.style.display = 'none';
    licenseFields.style.display = '';
    resultsContainer.style.display = '';
    setInstruction('Enter an index plate, starting by 0');
    resetButtons(licenseButton);
    clearResults();
    if (!licenseView) {
      licenseView = new LicensePlateView({
        onLicensePlateRequest: (n) => {
          try {
            const plate = licensePlateUseCase.execute(n);
            licenseView.displayMessage(`Index ${n}: ${plate}`);
          } catch (e) { licenseView.displayMessage(e.message, true); }
        }
      });
    }
  };

  const activate = (btn, handler) => {
    btn.addEventListener('click', handler);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  };

  activate(fetcherButton, showFetcher);
  activate(licenseButton, showLicense);

  resultsContainer.style.display = 'none';
  fetcherButton.classList.add('bg-gray-400');
  licenseButton.classList.add('bg-gray-400');
});
