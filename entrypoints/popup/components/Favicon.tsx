import { createMemo, createSignal, Show } from 'solid-js';
import { faviconUrl, hostname } from '../lib/history';

interface FaviconProps {
  url: string;
}

export default function Favicon(props: FaviconProps) {
  const [failed, setFailed] = createSignal(false);
  const src = createMemo(() => faviconUrl(props.url));
  const letter = createMemo(() => (hostname(props.url)[0] || '?').toUpperCase());

  return (
    <Show
      when={!failed() && src()}
      fallback={<span class="favicon favicon--fallback">{letter()}</span>}
    >
      <img
        class="favicon"
        src={src()}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </Show>
  );
}
