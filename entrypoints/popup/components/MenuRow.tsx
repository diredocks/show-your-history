import { Show } from 'solid-js';
import chevronIcon from '@/assets/chevron.svg?raw';
import Icon from './Icon';

interface MenuRowProps {
  label: string;
  chevron?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function MenuRow(props: MenuRowProps) {
  return (
    <button
      type="button"
      class="menu-row"
      classList={{ 'menu-row--disabled': props.disabled }}
      disabled={props.disabled}
      onClick={() => props.onClick?.()}
    >
      <span class="menu-row__label">{props.label}</span>
      <Show when={props.chevron}>
        <Icon src={chevronIcon} size={14} class="menu-row__chevron" />
      </Show>
    </button>
  );
}
