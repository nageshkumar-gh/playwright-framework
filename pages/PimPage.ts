import {Page,expect} from '@playwright/test'
import { BasePage } from './BasePage';

export class PimPage extends BasePage{

    public async clickAddEmp()
    {
        await this.page.getByRole('button',{name:"Add"}).click();
    }
    public async setFullName(firstName:string,midName:string,lastName:string)
    {
        await this.page.getByPlaceholder('First Name').fill(firstName);
        await this.page.getByPlaceholder('Middle Name').fill(midName);
        await this.page.getByPlaceholder('Last Name').fill(lastName);
    }
    public async setEmpId(empId:string)
    {
        await this.page.locator('.oxd-input-group:has-text("Employee Id") input').fill(empId);
    }
    public async clickSaveEmpName()
    {
        await this.page.getByRole('button',{name:"Save"}).click();
        

    }
    public async checkSucessNotification()
    {
        await expect(this.page.locator('.oxd-toast').filter({ hasText: 'Success' })).toContainText('Success');
    }
}