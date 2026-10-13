import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { i18n } from '#i18n';
import ClearDataView, { type ClearSelection } from './components/ClearDataView';
import ClosedTabsList from './components/ClosedTabsList';
import ClosedWindowsList from './components/ClosedWindowsList';
import EmptyState from './components/EmptyState';
import HistoryList from './components/HistoryList';
import MenuRow from './components/MenuRow';
import PanelFooter from './components/PanelFooter';
import SearchBox from './components/SearchBox';
import SubviewHeader from './components/SubviewHeader';
import {
  getRecentHistory,
  getRecentlyClosedTabs,
  getRecentlyClosedWindows,
  searchHistory,
  type ClosedTab,
  type ClosedWindow,
  type HistoryEntry,
} from './lib/history';
import { applyActionIcon, watchColorScheme } from './lib/theme';
import './App.css';

type Subview = 'closedTabs' | 'closedWindows' | 'search' | 'clearData';
type View = 'main' | Subview;

export default function App() {
  const [view, setView] = createSignal<View>('main');
  const [subview, setSubview] = createSignal<Subview | null>(null);
  const [recent, setRecent] = createSignal<HistoryEntry[]>([]);
  const [closedTabs, setClosedTabs] = createSignal<ClosedTab[]>([]);
  const [closedWindows, setClosedWindows] = createSignal<ClosedWindow[]>([]);
  const [results, setResults] = createSignal<HistoryEntry[]>([]);
  const [query, setQuery] = createSignal('');
  const [loading, setLoading] = createSignal(true);

  async function loadRecent() {
    setLoading(true);
    try {
      setRecent(await getRecentHistory());
    } finally {
      setLoading(false);
    }
  }

  async function loadClosed() {
    const [tabs, windows] = await Promise.all([
      getRecentlyClosedTabs().catch(() => [] as ClosedTab[]),
      getRecentlyClosedWindows().catch(() => [] as ClosedWindow[]),
    ]);
    setClosedTabs(tabs);
    setClosedWindows(windows);
  }

  onMount(() => {
    loadRecent();
    loadClosed();
  });

  onCleanup(watchColorScheme(applyActionIcon));

  let debounce: ReturnType<typeof setTimeout> | undefined;
  createEffect(() => {
    const text = query();
    const inSearch = view() === 'search';
    clearTimeout(debounce);
    if (!inSearch) return;
    debounce = setTimeout(async () => {
      setResults(await searchHistory(text.trim()));
    }, text ? 150 : 0);
  });

  function open(url: string) {
    browser.tabs.create({ url });
    window.close();
  }

  function openSubview(next: Subview) {
    setSubview(next);
    setView(next);
  }

  function backToMain() {
    setQuery('');
    setView('main');
  }

  async function restore(sessionId: string) {
    await browser.sessions.restore(sessionId);
    window.close();
  }

  async function restorePreviousSession() {
    await browser.sessions.restore();
    window.close();
  }

  async function clearData(selection: ClearSelection) {
    const dataToRemove: Browser.browsingData.DataTypeSet = {};
    if (selection.history) {
      dataToRemove.history = true;
      dataToRemove.downloads = true;
    }
    if (selection.cookies) {
      dataToRemove.cookies = true;
      dataToRemove.localStorage = true;
      dataToRemove.indexedDB = true;
      dataToRemove.cacheStorage = true;
      dataToRemove.serviceWorkers = true;
    }
    if (selection.cache) dataToRemove.cache = true;
    if (selection.formData) dataToRemove.formData = true;

    await browser.browsingData.remove({ since: selection.since }, dataToRemove);
    await Promise.all([loadRecent(), loadClosed()]);
    backToMain();
  }

  function manageHistory() {
    browser.tabs.create({ url: 'chrome://history/' });
    window.close();
  }

  const hasClosedSessions = () => closedTabs().length > 0 || closedWindows().length > 0;

  return (
    <div class="panel">
      <div class="viewport">
        <div
          class="track"
          style={{ transform: view() === 'main' ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <section class="view">
            <div class="panel__body">
              <MenuRow
                label={i18n.t('recentlyClosedTabs')}
                chevron
                onClick={() => openSubview('closedTabs')}
              />
              <MenuRow
                label={i18n.t('recentlyClosedWindows')}
                chevron
                disabled={closedWindows().length === 0}
                onClick={() => openSubview('closedWindows')}
              />
              <MenuRow
                label={i18n.t('searchHistory')}
                chevron
                onClick={() => openSubview('search')}
              />
              <MenuRow
                label={i18n.t('restorePreviousSession')}
                disabled={!hasClosedSessions()}
                onClick={restorePreviousSession}
              />

              <div class="menu-sep" />

              <MenuRow
                label={i18n.t('clearRecentHistory')}
                onClick={() => openSubview('clearData')}
              />

              <div class="menu-sep" />

              <div class="section-label">{i18n.t('recentHistory')}</div>
              <Show when={recent().length > 0} fallback={<EmptyState loading={loading()} />}>
                <HistoryList entries={recent()} onOpen={open} />
              </Show>
            </div>

            <PanelFooter onManage={manageHistory} />
          </section>

          <section class="view">
            <Show when={subview() === 'closedTabs'}>
              <SubviewHeader title={i18n.t('recentlyClosedTabs')} onBack={backToMain} />
              <div class="panel__body">
                <Show
                  when={closedTabs().length > 0}
                  fallback={<EmptyState message={i18n.t('closedTabsEmpty')} />}
                >
                  <ClosedTabsList entries={closedTabs()} onRestore={restore} />
                </Show>
              </div>
            </Show>

            <Show when={subview() === 'closedWindows'}>
              <SubviewHeader title={i18n.t('recentlyClosedWindows')} onBack={backToMain} />
              <div class="panel__body">
                <Show
                  when={closedWindows().length > 0}
                  fallback={<EmptyState message={i18n.t('closedWindowsEmpty')} />}
                >
                  <ClosedWindowsList entries={closedWindows()} onRestore={restore} />
                </Show>
              </div>
            </Show>

            <Show when={subview() === 'search'}>
              <SubviewHeader onBack={backToMain}>
                <SearchBox value={query()} onInput={setQuery} inline />
              </SubviewHeader>
              <div class="panel__body">
                <Show
                  when={results().length > 0}
                  fallback={<EmptyState message={i18n.t('empty')} />}
                >
                  <HistoryList entries={results()} onOpen={open} />
                </Show>
              </div>
            </Show>

            <Show when={subview() === 'clearData'}>
              <SubviewHeader title={i18n.t('clearDataTitle')} onBack={backToMain} />
              <ClearDataView onCancel={backToMain} onClear={clearData} />
            </Show>
          </section>
        </div>
      </div>
    </div>
  );
}
