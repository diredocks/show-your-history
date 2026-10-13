import type { HistoryEntry } from '../lib/history';
import Favicon from './Favicon';

interface HistoryItemProps {
  entry: HistoryEntry;
  onOpen: (url: string) => void;
}

export default function HistoryItem(props: HistoryItemProps) {
  return (
    <li class="item">
      <button class="item__main" onClick={() => props.onOpen(props.entry.url)}>
        <Favicon url={props.entry.url} />
        <span class="item__title">{props.entry.title}</span>
      </button>
    </li>
  );
}
