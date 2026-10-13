import { Show } from 'solid-js';
import { i18n } from '#i18n';

interface EmptyStateProps {
  loading?: boolean;
  message?: string;
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div class="empty">
      <Show when={props.loading} fallback={<span>{props.message ?? i18n.t('empty')}</span>}>
        <span>{i18n.t('loading')}</span>
      </Show>
    </div>
  );
}
