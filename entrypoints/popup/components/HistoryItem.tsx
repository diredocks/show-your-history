import type { HistoryEntry } from '../lib/history';
import Favicon from './Favicon';

interface HistoryItemProps {
  entry: HistoryEntry;
  onOpen: (url: string) => void;
}

export default function HistoryItem(props: HistoryItemProps) {
  return (
    <li class="item">
      <a
        class="item__main"
        href={props.entry.url}
        onClick={(e) => {
          e.preventDefault();
          props.onOpen(props.entry.url);
        }}
      >
        <Favicon url={props.entry.url} />
        <span class="item__title">{props.entry.title}</span>
      </a>
    </li>
  );
}
