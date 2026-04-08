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