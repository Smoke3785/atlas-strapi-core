import { test } from '@playwright/test';
import { navigateToStory } from '@test/e2e';
import { checkA11y } from 'axe-playwright';

test.describe.parallel('BaseLink', () => {
  test.describe('light mode', () => {
    test('triggers axe on the document', async ({ page }) => {
      await navigateToStory(page, 'design-system-technical-components-baselink--base');
      await checkA11y(page);
    });
  });

  test.describe('dark mode', () => {
    test('triggers axe on the document', async ({ page }) => {
      await navigateToStory(page, 'design-system-technical-components-baselink--base', { isDarkMode: true });
      await checkA11y(page);
    });
  });
});
