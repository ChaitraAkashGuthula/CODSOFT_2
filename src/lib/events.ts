import { EventEmitter } from "events";

type EventType = "order:created" | "order:updated" | "reservation:created" | "table:updated" | "ping";

interface RealtimePayload {
  type: EventType;
  data: any;
  timestamp: string;
}

class RealtimeDispatcher extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  broadcast(type: EventType, data: any) {
    const payload: RealtimePayload = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    this.emit("broadcast", payload);
  }
}

const globalForDispatcher = globalThis as unknown as {
  realtimeDispatcher: RealtimeDispatcher | undefined;
};

export const realtimeDispatcher =
  globalForDispatcher.realtimeDispatcher ?? new RealtimeDispatcher();

if (process.env.NODE_ENV !== "production") {
  globalForDispatcher.realtimeDispatcher = realtimeDispatcher;
}
