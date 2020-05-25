import { Nullable } from "./types";

export class Store {
  keyprefix: string;
  constructor(keyprefix: string) {
    this.keyprefix = keyprefix;
  }

  normalizedKey(key: string): string {
    return this.keyprefix + ":" + key;
  }

  async get(_key: string) {
    return null as any;
  }
  async set(_key: string, _value: Nullable<any>) {
    return null as any;
  }
  async remove(_key: string) {
    return null as any;
  }
}
