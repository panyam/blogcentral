import { Nullable, Timestamp, Undefined } from "./types";

export type EventType = any;
export type EventCallback = (
  eventType: EventType,
  eventSource: EventSource,
  eventData: any
) => Undefined<boolean>;

/**
 * EventHandler interface.  EventHandling in Sistine follows a two phase paradigm.
 * First the event is sent to all handlers for validation.  If any of the validators
 * return false, the event is suppressed.  After all validations have been approved
 * the changes backed by the event are applied and the event is "triggered" and handled
 * by the handlers.  If any of the handlers now return false, the event handling is
 * now suppressed.
 */
export interface EventHandler {
  /**
   * Handler method called before an event is "committed".  This gives the handlers a
   * chance to process and validate the changes the event is being triggered for.
   *
   * @param {Object} eventType    Type of event being sent.
   * @param {EventSource} source  The source generating the event.
   * @param {Object} eventData    The event specific data.
   *
   * @returns {Bool} true if event is validated, false if validation failed and needs to be suppressed.
   */
  handleBefore(
    eventType: string,
    source: EventSource,
    eventData: any
  ): Undefined<boolean>;

  /**
   * Handler method called after an event is "committed".  This serves more as a notification
   * of a change but event hanling can still be suppressed if this method returns false.
   *
   * @param {Object} eventType    Type of event being sent.
   * @param {EventSource} source  The source generating the event.
   * @param {Object} eventData    The event specific data.
   *
   * @returns {Bool} true if event is validated, false if validation failed and needs to be suppressed.
   */
  handleOn(
    eventType: string,
    source: EventSource,
    eventData: any
  ): Undefined<boolean>;
}

/**
 * Super class of all Events.
 */
export class Event {
  private _eventType: any = null; // eventType;
  private _timeStamp: Timestamp = Date.now();
  private _suppressed: boolean = false;

  /**
   * Returns the creation timestamp of this event.
   */
  get timeStamp() {
    return this._timeStamp;
  }

  /**
   * Suppresses this event.
   */
  suppress() {
    this._suppressed = true;
  }

  /**
   * Returns the name of this event.
   * @returns {String} Name of this event class.
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * Returns if the event was suppressed or not.
   * @returns {Bool}
   */
  get wasSuppressed() {
    return this._suppressed;
  }

  /**
   * Returns type of this event.
   * @returns {Object}
   */
  get eventType() {
    return this._eventType;
  }
}

/*
export class EventSource {
  private _eventHub = new EventHub();

  addHandler(eventTypes: Array<EventType> | string, handler: EventHandler) {
    this._eventHub.addHandler(eventTypes, handler);
    return this;
  }

  removeHandler(eventTypes: Array<EventType> | string, handler: EventHandler) {
    this._eventHub.removeHandler(eventTypes, handler);
    return this;
  }

  on(eventTypes: Array<EventType> | string, callback: EventCallback) {
    this._eventHub.on(eventTypes, callback);
    return this;
  }

  before(eventTypes: Array<EventType> | string, callback: EventCallback) {
    this._eventHub.before(eventTypes, callback);
    return this;
  }

  validateBefore(eventType: EventType, eventData: any) {
    var source = this;
    return this._eventHub.validateBefore(eventType, source, eventData) != false;
  }

  triggerOn(eventType: EventType, eventData: any) {
    var source = this;
    return this._eventHub.triggerOn(eventType, source, eventData) != false;
  }
}
*/

export class EventHub {
  private _muted = false;
  private _onCallbacks: { [key: string]: Array<EventCallback> } = {};
  private _beforeCallbacks: { [key: string]: Array<EventCallback> } = {};
  private _handlers: { [key: string]: Array<EventHandler> } = {};
  private _next: Array<EventHub> = [];
  constructor(next: Nullable<EventHub> = null) {
    if (next != null) {
      this._next.push(next);
    }
  }

  get isMuted() {
    return this._muted;
  }
  mute() {
    this._muted = true;
  }
  unmute() {
    this._muted = false;
  }

  chain(another: EventHub) {
    if (
      this._next.findIndex(function (value) {
        return value == another;
      }) < 0
    ) {
      this._next.push(another);
    }
  }

  unchain(another: EventHub) {
    var index = this._next.findIndex(function (value) {
      return value == another;
    });
    if (index >= 0) {
      this._next.splice(index, 1);
    }
  }

  before(eventTypes: Array<EventType> | string, callback: EventCallback) {
    return this._addHandler(eventTypes, this._beforeCallbacks, callback);
  }

  on(eventTypes: Array<EventType> | string, callback: EventCallback) {
    return this._addHandler(eventTypes, this._onCallbacks, callback);
  }

  removeBeforeon(
    eventTypes: Array<EventType> | string,
    callback: EventCallback
  ) {
    return this._removeHandler(eventTypes, this._beforeCallbacks, callback);
  }

  removeOn(eventTypes: Array<EventType> | string, callback: EventCallback) {
    return this._removeHandler(eventTypes, this._onCallbacks, callback);
  }

  addHandler(eventTypes: Array<EventType> | string, handler: EventHandler) {
    return this._addHandler(eventTypes, this._handlers, handler);
  }

  removeHandler(eventTypes: Array<EventType> | string, handler: EventHandler) {
    return this._removeHandler(eventTypes, this._handlers, handler);
  }

  _addHandler<T>(
    eventTypes: Array<EventType> | string,
    handlerlist: { [key: string]: Array<T> },
    handler: T
  ) {
    if (typeof eventTypes === "string") {
      eventTypes = (eventTypes as string).split(",").map(function (v) {
        return v.trim();
      });
    }
    eventTypes.forEach(function (eventType) {
      eventType = eventType.trim();
      handlerlist[eventType] = handlerlist[eventType] || [];
      handlerlist[eventType].push(handler);
    });
    return this;
  }

  _removeHandler<T>(
    eventTypes: Array<EventType> | string,
    handlerlist: { [key: string]: Array<T> },
    handler: T
  ) {
    if (typeof eventTypes === "string") {
      eventTypes = (eventTypes as string).split(",").map(function (v) {
        return v.trim();
      });
    }
    eventTypes.forEach(function (eventType) {
      eventType = eventType.trim();
      var evHandlers = handlerlist[eventType] || [];
      for (var i = 0; i < evHandlers.length; i++) {
        if (evHandlers[i] == handler) {
          evHandlers.splice(i, 1);
          break;
        }
      }
    });
    return this;
  }

  /**
   * This is called after a particular change has been approved to notify that
   * a change has indeed gone through.
   */
  validateBefore(eventType: EventType, source: EventSource, eventData: any) {
    if (this._muted) return true;
    if (
      this._trigger(eventType, source, eventData, this._beforeCallbacks) ==
      false
    ) {
      return false;
    }
    var handlers = this._handlers[eventType] || [];
    for (var i = 0, L = handlers.length; i < L; i++) {
      if (handlers[i].handleBefore(eventType, source, eventData) == false) {
        return false;
      }
    }
    for (var i = this._next.length - 1; i >= 0; i--) {
      if (this._next[i].validateBefore(eventType, source, eventData) == false) {
        return false;
      }
    }
    return true;
  }
  triggerOn(eventType: EventType, source: EventSource, eventData: any) {
    if (this._muted) return true;
    if (
      this._trigger(eventType, source, eventData, this._onCallbacks) == false
    ) {
      return false;
    }
    var handlers = this._handlers[eventType] || [];
    for (var i = 0, L = handlers.length; i < L; i++) {
      if (handlers[i].handleOn(eventType, source, eventData) == false) {
        return false;
      }
    }

    // also go through handlers
    for (var i = this._next.length - 1; i >= 0; i--) {
      if (this._next[i].triggerOn(eventType, source, eventData) == false) {
        return false;
      }
    }
    return true;
  }

  _trigger(
    eventType: EventType,
    source: EventSource,
    eventData: any,
    callbacks: { [key: string]: Array<EventCallback> }
  ): boolean {
    var evtCallbacks = callbacks[eventType] || [];
    for (var i = 0, L = evtCallbacks.length; i < L; i++) {
      var callback = evtCallbacks[i];
      if (callback(eventType, source, eventData) == false) {
        return false;
      }
    }
    return true;
  }
}
