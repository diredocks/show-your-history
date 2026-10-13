import { i18n } from '#i18n';
import { isMac } from '../lib/history';

interface PanelFooterProps {
  onManage: () => void;
}

export default function PanelFooter(props: PanelFooterProps) {
  const shortcut = isMac() ? i18n.t('manageHistoryShortcutMac') : i18n.t('manageHistoryShortcut');

  return (
    <footer class="panel__footer">
      <button type="button" class="menu-row" onClick={props.onManage}>
        <span class="menu-row__label">{i18n.t('manageHistory')}</span>
        <span class="menu-row__shortcut">{shortcut}</span>
      </button>
    </footer>
  );
}
