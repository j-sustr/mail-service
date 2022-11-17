const CANCEL = Symbol();

export class CancellationToken {
  private _cancelled = false;
  private _onCancelListeners: Array<() => void> = [];

  isCancelled() {
    return this._cancelled === true;
  }

  addCancelListener(callbackFn: () => void) {
    this._onCancelListeners.push(callbackFn);
  }

  [CANCEL]() {
    this._cancelled = true;
    this._onCancelListeners.forEach((callbackFn) => callbackFn());
  }
}

export default class CancellationTokenSource {
  private _token = new CancellationToken();

  get token() {
    return this._token;
  }

  cancel() {
    this._token[CANCEL]();
  }
}
