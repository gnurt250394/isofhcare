

class CallManager {
  _defaultCall = null;
  startCall(booking, isOffer) {
    const ref = this.getDefault();

    if (!!ref) {
      ref.startCall(booking, isOffer);
    }
  }
  register(_ref) {
    if (!this._defaultCall) {
      this._defaultCall = _ref;
    }
  }

  unregister(_ref) {
    if (!!this._defaultCall && this._defaultCall._id === _ref._id) {
      this._defaultCall = null;
    }
  }

  getDefault() {
    return this._defaultCall;
  }
}

export default new CallManager();
