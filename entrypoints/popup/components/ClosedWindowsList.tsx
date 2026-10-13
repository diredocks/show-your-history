import { For } from 'solid-js';
import { i18n } from '#i18n';
import type { ClosedWindow } from '../lib/history';

interface ClosedWindowsListProps {
  entries: ClosedWindow[];
  onRestore: (sessionId: string) => void;
}

export default function ClosedWindowsList(props: ClosedWindowsListProps) {
  return (
    <ul class="list">
      <For each={props.entries}>
        {(entry) => (
          <li class="item">
            <button class="item__main" onClick={() => props.onRestore(entry.sessionId)}>
              <span class="item__title">{entry.title || i18n.t('tabCount', entry.tabCount)}</span>
            </button>
          </li>
        )}
      </For>
    </ul>
  );
}
