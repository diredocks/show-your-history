import { i18n } from '#i18n';
import searchIcon from '@/assets/search.svg?raw';
import Icon from './Icon';

interface SearchBoxProps {
  value: string;
  onInput: (value: string) => void;
  inline?: boolean;
}

export default function SearchBox(props: SearchBoxProps) {
  return (
    <div class={props.inline ? 'search search--inline' : 'search'}>
      <Icon src={searchIcon} size={15} class="search__icon" />
      <input
        class="search__input"
        type="search"
        value={props.value}
        placeholder={i18n.t('searchPlaceholder')}
        autofocus
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
    </div>
  );
}
