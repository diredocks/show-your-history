import { For } from 'solid-js';
import type { HistoryEntry } from '../lib/history';
import HistoryItem from './HistoryItem';

interface HistoryListProps {
  entries: HistoryEntry[];
  onOpen: (url: string) => void;
}

export default function HistoryList(props: HistoryListProps) {
  return (
    <ul class="list">
      <For each={props.entries}>
        {(entry) => <HistoryItem entry={entry} onOpen={props.onOpen} />}
      </For>
    </ul>
  );
}
