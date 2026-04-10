
import {Page} from '@playwright/test'
import {BasePage} from './BasePage'

export class HeaderAndMenuPage extends BasePage{

    public getHeaderTitle()
    {
        return this.page.locator("//div[@class='oxd-topbar-header']/div/span/h6");
    }
    public async clickLogout()
    {
        this.page.locator("//span[@class='oxd-userdropdown-tab']/i").click();
        this.page.getByText('Logout').click();
    }
}