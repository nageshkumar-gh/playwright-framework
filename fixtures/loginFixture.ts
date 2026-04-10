import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

type loginFixture = {
  loginPage: LoginPage;
}

export const test = base.extend<loginFixture>({

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto("/");
    await loginPage.setUsername(process.env.USERNAME!);
    await loginPage.setPassword(process.env.PASSWORD!);
    await loginPage.clickLogin();
    await use(loginPage);
  }

})

export { expect }


