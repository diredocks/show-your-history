import { Show, type JSX } from 'solid-js';
import { i18n } from '#i18n';
import arrowLeft from '@/assets/arrow-left.svg?raw';
import Icon from './Icon';

interface SubviewHeaderProps {
  title?: string;
  onBack: () => void;
  children?: JSX.Element;
}

export default function SubviewHeader(props: SubviewHeaderProps) {
  return (
    <div class="subview-header">
      <button
        class="icon-btn"
        title={i18n.t('back')}
        aria-label={i18n.t('back')}
        onClick={props.onBack}
      >
        <Icon src={arrowLeft} />
      </button>
      <Show
        when={props.children}
        fallback={<span class="subview-header__title">{props.title}</span>}
      >
        <div class="subview-header__content">{props.children}</div>
      </Show>
    </div>
  );
}
