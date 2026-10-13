import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-solid', '@wxt-dev/i18n/module'],
  manifest: {
    default_locale: 'en',
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    permissions: ['history', 'sessions', 'browsingData', 'favicon', 'tabs'],
    action: {
      default_icon: {
        16: 'icon/toolbar/light-16.png',
        24: 'icon/toolbar/light-24.png',
        32: 'icon/toolbar/light-32.png',
      },
    },
  },
  webExt: {
    disabled: true,
  },
});
