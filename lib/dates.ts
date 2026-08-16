const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

/** Today's date in Asia/Kolkata as YYYY-MM-DD, independent of server timezone. */
export function kolkataToday(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10)
}
