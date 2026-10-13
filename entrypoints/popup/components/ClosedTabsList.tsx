import { For } from 'solid-js';
import type { ClosedTab } from '../lib/history';
import Favicon from './Favicon';

interface ClosedTabsListProps {
  entries: ClosedTab[];
  onRestore: (sessionId: string) => void;
}

export default function ClosedTabsList(props: ClosedTabsListProps) {
  return (
    <ul class="list">
      <For each={props.entries}>
        {(entry) => (
          <li class="item">
            <button class="item__main" onClick={() => props.onRestore(entry.sessionId)}>
              <Favicon url={entry.url} />
              <span class="item__title">{entry.title}</span>
            </button>
          </li>
        )}
      </For>
    </ul>
  );
}
