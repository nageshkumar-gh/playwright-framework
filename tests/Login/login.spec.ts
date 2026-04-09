import test,{expect} from '@playwright/test'
import loginData from '../../test-data/login-data.json'

test("Admin can login with valid credentials",
    async({page})=>
    {
        await page.goto("/");
        await page.getByPlaceholder('Username').fill(process.env.USERNAME!);
        await page.getByPlaceholder('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByRole('heading', { name: "Dashboard" })).toBeVisible();
    }
)

test("User sees error message with invalid username and password",
    async({page})=>
    {
        await page.goto("/");
        await page.getByPlaceholder('Username').fill(loginData.invalidUser.username);
        await page.getByPlaceholder('Password').fill(loginData.invalidUser.password);
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByText('Invalid credentials')).toBeVisible();
    }
)

test("User cannot login with empty credentials",
    async({page})=>
    {
        await page.goto("/");
        await page.getByPlaceholder('Username').fill(loginData.emptyUser.username);
        await page.getByPlaceholder('Password').fill(loginData.emptyUser.password);
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByText('Required')).toHaveCount(2);
    }
)

test("Admin can logout successfully",
    async({page})=>
    {
        await page.goto("/");
        await page.getByPlaceholder('Username').fill(process.env.USERNAME!);
        await page.getByPlaceholder('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByRole('heading', { name: "Dashboard" })).toBeVisible();

        await page.locator("//span[@class='oxd-userdropdown-tab']/i").click();
        await page.getByText('Logout').click();
    }
)

test("Session expired redirects to login",
    async({page,context})=>
    {
    
        await page.goto("/");
        await page.getByPlaceholder('Username').fill(process.env.USERNAME!);
        await page.getByPlaceholder('Password').fill(process.env.PASSWORD!);
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByRole('heading', { name: "Dashboard" })).toBeVisible();

        await context.clearCookies();
        await page.reload();

        await expect(page.getByRole('heading',{name:'Login'})).toBeVisible();
    }
)