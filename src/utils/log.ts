export type LogType = "recommend_impression" | "click_event" | "like_event";

export function logEvent(type: LogType, eventId: string) {
  try {
    const w = window as any;
    if (!w.__recLogs) w.__recLogs = [];
    w.__recLogs.push({ type, eventId, ts: Date.now() });
  } catch (err) {
    // noop in non-browser environments
    // console.debug("logEvent failed", err);
  }
}
