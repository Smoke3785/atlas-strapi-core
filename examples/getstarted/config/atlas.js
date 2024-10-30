module.exports = ({ env }) => {
  return {
    dashboard: { title: 'Atlas Dashboard', version: '0.0.2' },
    client: {
      organizationTitle: 'Atlas Demonstration',
      organizationWebsite: 'atlas.iliad.dev',
    },
    iliad: {
      supportEmail: 'support@iliad.dev',
      organizationWebsite: 'iliad.dev',
      organizationTitle: 'Iliad.dev',
    },
    sideMenu: {
      floatingTop: ['upload.plugin.name'],
      mySite: ['strapi-plugin-redirects', 'plausible.plugin.name', 'menus.plugin.name'],
      plugins: [
        'email-designer.plugin.name',
        'plugin-atlas-ai.plugin.name',
        'calendar.plugin.name',
      ],
      floatingBottom: ['plugin-atlas-docs.plugin.name', 'global.settings'],
    },
  };
};