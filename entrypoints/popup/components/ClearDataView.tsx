import { createSignal, For } from 'solid-js';
import { i18n } from '#i18n';
import warningIcon from '@/assets/warning.svg?raw';
import Icon from './Icon';

export interface ClearSelection {
  since?: number;
  history: boolean;
  cookies: boolean;
  cache: boolean;
  formData: boolean;
}

type RangeValue = 'hour' | 'twoHours' | 'fourHours' | 'today' | 'all';
type ItemKey = 'history' | 'cookies' | 'cache' | 'formData';

interface ClearDataViewProps {
  onCancel: () => void;
  onClear: (selection: ClearSelection) => void;
}

const RANGES = [
  { value: 'hour', label: 'rangeHour' },
  { value: 'twoHours', label: 'rangeTwoHours' },
  { value: 'fourHours', label: 'rangeFourHours' },
  { value: 'today', label: 'rangeToday' },
  { value: 'all', label: 'rangeAll' },
] as const;

function sinceFor(range: RangeValue): number | undefined {
  const now = Date.now();
  switch (range) {
    case 'hour':
      return now - 60 * 60 * 1000;
    case 'twoHours':
      return now - 2 * 60 * 60 * 1000;
    case 'fourHours':
      return now - 4 * 60 * 60 * 1000;
    case 'today': {
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      return midnight.getTime();
    }
    case 'all':
      return undefined;
  }
}

const ITEMS = [
  { key: 'history', label: 'clearHistory', desc: 'clearHistoryDesc' },
  { key: 'cookies', label: 'clearCookies', desc: 'clearCookiesDesc' },
  { key: 'cache', label: 'clearCache', desc: 'clearCacheDesc' },
  { key: 'formData', label: 'clearForms', desc: 'clearFormsDesc' },
] as const;

export default function ClearDataView(props: ClearDataViewProps) {
  const [range, setRange] = createSignal<RangeValue>('all');
  const [selected, setSelected] = createSignal<Record<ItemKey, boolean>>({
    history: true,
    cookies: true,
    cache: true,
    formData: true,
  });

  function toggle(key: ItemKey) {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function submit() {
    props.onClear({
      since: sinceFor(range()),
      ...selected(),
    });
  }

  return (
    <>
      <div class="panel__body clear-data">
        <label class="clear-data__when">
          <span>{i18n.t('when')}</span>
          <select
            class="select"
            value={range()}
            onChange={(e) => setRange(e.currentTarget.value as RangeValue)}
          >
            <For each={RANGES}>
              {(r) => <option value={r.value}>{i18n.t(r.label)}</option>}
            </For>
          </select>
        </label>

        <div class="clear-warning">
          <Icon src={warningIcon} size={20} class="clear-warning__icon" />
          <span>{range() === 'all' ? i18n.t('clearWarningAll') : i18n.t('clearWarningRange')}</span>
        </div>

        <For each={ITEMS}>
          {(item) => (
            <label class="check-item">
              <input
                type="checkbox"
                checked={selected()[item.key]}
                onChange={() => toggle(item.key)}
              />
              <span class="check-item__text">
                <span class="check-item__title">{i18n.t(item.label)}</span>
                <span class="check-item__desc">{i18n.t(item.desc)}</span>
              </span>
            </label>
          )}
        </For>
      </div>

      <div class="clear-data__footer">
        <button class="btn" onClick={props.onCancel}>
          {i18n.t('cancel')}
        </button>
        <button class="btn btn--primary" onClick={submit}>
          {i18n.t('clear')}
        </button>
      </div>
    </>
  );
}
