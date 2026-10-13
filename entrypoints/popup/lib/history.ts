export const HISTORY_WINDOW = 90 * 24 * 60 * 60 * 1000;
export const RECENT_HISTORY_LIMIT = 25;
export const SEARCH_HISTORY_LIMIT = 100;

export interface HistoryEntry {
  url: string;
  title: string;
  lastVisitTime: number;
}

export interface ClosedTab {
  sessionId: string;
  title: string;
  url: string;
}

export interface ClosedWindow {
  sessionId: string;
  title: string;
  tabCount: number;
}

export function isMac(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return /mac/i.test(nav.userAgentData?.platform ?? nav.platform ?? '');
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function faviconUrl(url: string): string {
  try {
    return browser.runtime.getURL(`/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`);
  } catch {
    return '';
  }
}

function toEntries(results: Browser.history.HistoryItem[]): HistoryEntry[] {
  return results
    .filter((r): r is typeof r & { url: string } => !!r.url)
    .map((r) => ({
      url: r.url,
      title: r.title || hostname(r.url) || r.url,
      lastVisitTime: r.lastVisitTime ?? Date.now(),
    }));
}

export async function getRecentHistory(maxResults = RECENT_HISTORY_LIMIT): Promise<HistoryEntry[]> {
  const results = await browser.history.search({
    text: '',
    startTime: Date.now() - HISTORY_WINDOW,
    maxResults,
  });
  return toEntries(results);
}

export async function searchHistory(text: string, maxResults = SEARCH_HISTORY_LIMIT): Promise<HistoryEntry[]> {
  const results = await browser.history.search({
    text,
    startTime: Date.now() - HISTORY_WINDOW,
    maxResults,
  });
  return toEntries(results);
}

export async function getRecentlyClosedTabs(maxResults = 25): Promise<ClosedTab[]> {
  const sessions = await browser.sessions.getRecentlyClosed({ maxResults });
  const tabs: ClosedTab[] = [];
  for (const session of sessions) {
    const tab = session.tab;
    if (!tab?.url || !tab.sessionId) continue;
    tabs.push({ sessionId: tab.sessionId, title: tab.title || hostname(tab.url), url: tab.url });
  }
  return tabs;
}

export async function getRecentlyClosedWindows(): Promise<ClosedWindow[]> {
  const sessions = await browser.sessions.getRecentlyClosed();
  const windows: ClosedWindow[] = [];
  for (const session of sessions) {
    const win = session.window;
    if (!win?.sessionId) continue;
    const tabs = win.tabs ?? [];
    windows.push({
      sessionId: win.sessionId,
      title: tabs[0]?.title || '',
      tabCount: tabs.length,
    });
  }
  return windows;
}
