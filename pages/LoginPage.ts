import {Page,expect} from '@playwright/test'

export class LoginPage
{
    readonly page: Page;

    constructor (page: Page)
    {
        this.page=page;
    }

    public async setUsername(username: string)
    {
        await this.page.getByPlaceholder('Username').fill(username);
    }
    public async setPassword(password: string)
    {
        await this.page.getByPlaceholder('Password').fill(password);
    }
    public async clickLogin()
    {
        await this.page.getByRole('button',{name:'Login'}).click();   
    }
    public getLoginTitle()
    {
        return this.page.getByRole('heading',{name:'Login'});
    }
    public getErrorMsg()
    {
        return this.page.getByText('Required');
    }

    
}