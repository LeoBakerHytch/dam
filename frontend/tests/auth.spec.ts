import { expect, test } from '@playwright/test';

test.setTimeout(10_000);

// Log console errors to help with debugging
test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    }
  });
  page.on('pageerror', (error) => {
    console.log('Page error:', error.message);
  });
});

test.describe('Authentication', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('can register a new user and navigate to dashboard', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    const password = 'TestPassword123!';
    const name = `Test User ${timestamp}`;

    await page.goto('/register');

    await page.getByTestId('register-name-input').fill(name);
    await page.getByTestId('register-email-input').fill(email);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-password-confirmation-input').fill(password);

    // Wait for the registration mutation to complete
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/graphql') && response.request().method() === 'POST',
    );

    await page.getByTestId('register-user-button').click();
    await responsePromise;

    // After successful registration, should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
  });

  test('can login with existing credentials', async ({ page }) => {
    // First, register a user
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    const password = 'TestPassword123!';
    const name = `Test User ${timestamp}`;

    await page.goto('/register');
    await page.getByTestId('register-name-input').fill(name);
    await page.getByTestId('register-email-input').fill(email);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-password-confirmation-input').fill(password);
    await page.getByTestId('register-user-button').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });

    // Logout using the UI
    await page.getByTestId('user-menu-trigger').click();
    await page.getByTestId('logout-button').click();

    // Should be redirected to login
    await expect(page).toHaveURL('/login', { timeout: 5_000 });

    // Login with the same credentials
    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill(password);
    await page.getByTestId('login-button').click();

    // Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
  });
});
