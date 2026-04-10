import {test,expect} from '../../fixtures/loginFixture';
import { HeaderAndMenuPage } from '../../pages/HeaderAndMenuPage';
import { PimPage } from '../../pages/PimPage';
import { randomEmpIdData } from '../../utils/empIdGenerator';
import { generateFullName } from '../../utils/nameGenerator';


test("Admin can add a new employee",
    async({loginPage},testInfo)=>
    {
        await test.step('Admin select the PIM Menu from left menu panel',
            async({})=>
            {
                const menu=new HeaderAndMenuPage(loginPage.page);
                await menu.selectMenuTitle("PIM");
            }
        )
        await test.step('Admin click on the add employee button',
            async({})=>
            {
                const pimPage=new PimPage(loginPage.page);
                await pimPage.clickAddEmp();
                
            }
        )
        await test.step('Admin enters employee id and fullname, then save',
            async({})=>
            {
                const pimPage=new PimPage(loginPage.page);
                await pimPage.setFullName(generateFullName().firstName,generateFullName().middleName,generateFullName().lastName);
                await pimPage.setEmpId("TD-"+randomEmpIdData());
                await pimPage.clickSaveEmpName();
                
            }
        
        )
        await test.step('Verify notification of sucess visible after save',
            async({})=>
            {
                const pimPage=new PimPage(loginPage.page);
                await pimPage.checkSucessNotification();
            }

        
        )

        
    }
)
