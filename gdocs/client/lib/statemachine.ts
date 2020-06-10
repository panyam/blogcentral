import { Int, Nullable } from "./types";
import * as counters from "./counters";

const StateIdCounter = new counters.Counter("StateIds");

export type EventSource = any;

/**
 * StateMachines allow declarative and stateful chaining of events.
 */
export class StateMachine {
  private _states: { [key: string]: State } = {};
  private _rootState: Nullable<State> = null;
  private _currentState: Nullable<State> = null;
  constructor() {
    this._states = {};
    this._rootState = null;
    this._currentState = null;
  }

  /**
   * The starting/root state of the machine.
   *
   * @param {String} name  Name of the default/root state.
   */
  set rootState(name: string) {
    this._rootState = this.getState(name);
    if (this._currentState == null) {
      this._currentState = this._rootState;
    }
  }

  /**
   * Exits the current state (if any) and enters a new state.
   *
   * @param {String}   state   Name of the new state to enter.
   * @param {Object}   data    State specific data for the state handler to use for the new state.
   */
  enter(state: string, data: any = null) {
    if (state == "") {
      this._currentState = this._rootState;
    } else {
      this._currentState = this.getState(state);
    }
    if (this._currentState != null) {
      this._currentState.enter(data);
    }
  }

  /**
   * Get the state by name.
   *
   * @param {String} name  Name of the state being queried.
   * @returns {State} State object associated with the name.
   */
  getState(name: string): State {
    if (!(name in this._states)) {
      throw Error("State '" + name + "' not yet registered.");
    }
    return this._states[name];
  }

  /**
   * Register a new state in the state machine.
   *
   * @param {State} state  State being registered.  If another State with the same name exists, then a {DuplicateError} is thrown.
   * @param {Bool} isRoot  Whether the new state is a root state.
   */
  registerState(state: State, isRoot: boolean) {
    var name = state.name;
    if (name in this._states) {
      throw Error("State '" + name + "' already registered.");
    }
    this._states[name] = state;
    if (isRoot || false) {
      this.rootState = state.name;
    }
  }

  /**
   * Handles an event from the current state in the state machine possibly resulting in a state transition.
   *
   * @param {Object} eventType    Type of event being sent.
   * @param {EventSource} source  The source generating the event.
   * @param {Object} eventData    The event specific data.
   */
  handle(eventType: any, source: EventSource, eventData: any) {
    if (this._currentState == null) return;

    var nextState = this._currentState.handle(eventType, source, eventData);
    if (nextState != null) {
      if (nextState == "") {
        if (this._rootState != null) {
          this.enter(this._rootState.name);
        } else {
          throw new Error("Root state has not been set");
        }
      } else {
        this.enter(nextState);
      }
    }
  }
}

export class State {
  stateData: any = null;
  _id: Int;
  constructor() {
    this._id = StateIdCounter.next();
  }

  get name() {
    return this.constructor.name;
  }

  get id() {
    return this._id;
  }

  enter(data: any) {
    this.stateData = data;
  }

  handle(
    _eventType: any,
    _source: EventSource,
    _eventData: any
  ): Nullable<string> {
    return null;
  }
}
