import test,{expect} from '@playwright/test';

test("valid login",
    async({page})=>
    {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
        await page.getByPlaceholder('Username').fill("Admin");
        await page.getByPlaceholder('Password').fill("admin123");
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByRole('heading', { name: "Dashboard" })).toBeVisible();
    }
)

test("invalid login",
    async({page})=>
    {
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
        await page.getByPlaceholder('Username').fill("Admin");
        await page.getByPlaceholder('Password').fill("admin");
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page.getByText('Invalid credentials')).toBeVisible();
    }
)