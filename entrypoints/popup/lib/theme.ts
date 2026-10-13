const ICONS = {
  light: {
    16: 'icon/toolbar/light-16.png',
    24: 'icon/toolbar/light-24.png',
    32: 'icon/toolbar/light-32.png',
  },
  dark: {
    16: 'icon/toolbar/dark-16.png',
    24: 'icon/toolbar/dark-24.png',
    32: 'icon/toolbar/dark-32.png',
  },
} as const;

export function applyActionIcon(dark: boolean) {
  browser.action.setIcon({ path: dark ? ICONS.dark : ICONS.light }).catch(() => {});
}

export function watchColorScheme(onChange: (dark: boolean) => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handle = () => onChange(media.matches);
  handle();
  media.addEventListener('change', handle);
  return () => media.removeEventListener('change', handle);
}
