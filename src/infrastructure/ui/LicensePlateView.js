import { BaseView } from './BaseView.js';

export class LicensePlateView extends BaseView {
  constructor({ onLicensePlateRequest }) {
    super('results');
    this.onLicensePlateRequest = onLicensePlateRequest;
    this.plateIndexInput = document.getElementById('plateIndexInput');
    this.plateButton = document.getElementById('plateButton');
    this._wire();
  }
  _wire() {
    const handler = () => {
      const n = parseInt(this.plateIndexInput.value, 10);
      this.onLicensePlateRequest(n);
    };
    this.addActivation(this.plateButton, handler);
    this.addEnterHandler(this.plateIndexInput, handler);
  }
}
