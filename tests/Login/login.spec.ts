import loginData from '../../test-data/login-data.json'
import {test,expect} from '../../fixtures/loginFixture';
import { HeaderAndMenuPage } from '../../pages/HeaderAndMenuPage';
import { LoginPage } from '../../pages/LoginPage';

test("Admin can login with valid credentials",
    async({loginPage})=>
    {
        await test.step('Verify Dashboard header is visible with correct title', 
            async () => {
                const headerPage = new HeaderAndMenuPage(loginPage.page);
                await expect(headerPage.getHeaderTitle()).toHaveCount(1);
                await expect(headerPage.getHeaderTitle()).toBeVisible();
                await expect(headerPage.getHeaderTitle()).toHaveText("Dashboard");
            });
    }
)

test("User sees error message with invalid username and password",
    async({page})=>
    {
        const lp = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await page.goto("/");
        });

        await test.step('Enter invalid username and password', async () => {
            await lp.setUsername(loginData.invalidUser.username);
            await lp.setPassword(loginData.invalidUser.password);
        });

        await test.step('Click Login button', async () => {
            await lp.clickLogin();
        });

        await test.step('Verify invalid credentials error message is shown', async () => {
            await expect(page.getByText('Invalid credentials')).toBeVisible();
        });
    }
)

test("User cannot login with empty credentials",
    async({page})=>
    {
        const lp = new LoginPage(page);

        await test.step('Navigate to login page', async () => {
            await page.goto("/");
        });

        await test.step('Click Login button without entering credentials', async () => {
            await lp.clickLogin();
        });

        await test.step('Verify required field error messages are shown for username and password', async () => {
            await expect(lp.getErrorMsg()).toHaveCount(2);
            await expect(lp.getErrorMsg().nth(0)).toBeVisible();
            await expect(lp.getErrorMsg().nth(1)).toBeVisible();
            await expect(lp.getErrorMsg()).toHaveText(['Required', 'Required']);
        });
    }
)

test("Admin can logout successfully",
    async({loginPage})=>
    {
        const headerPage = new HeaderAndMenuPage(loginPage.page);

        await test.step('Click logout from user dropdown', async () => {
            await headerPage.clickLogout();
        });

        await test.step('Verify user is redirected to Login page', async () => {
            await expect(loginPage.getLoginTitle()).toBeVisible();
            await expect(loginPage.getLoginTitle()).toHaveCount(1);
            await expect(loginPage.getLoginTitle()).toHaveText("Login");
        });
    }
)

test("Session expired redirects to login",
    async({loginPage, context})=>
    {
        await test.step('Clear browser cookies to simulate session expiry', async () => {
            await context.clearCookies();
        });

        await test.step('Verify user is redirected to Login page', async () => {
            await expect(loginPage.getLoginTitle()).toBeVisible();
        });
    }
)
