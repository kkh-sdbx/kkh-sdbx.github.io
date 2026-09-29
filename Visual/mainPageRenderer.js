/**
<div id = "queueModal" class = "G_modal">
    <div class = "queueModalBody">
        <h2 id="queueModalTitle"> Modal Title</h2>
        <h4 id="queueModalContent"> Modal Content</h4> 
        <div class = "queueModalContainer">
            <button id = "acceptBtn">Proceed</button>
            <button id = "ejectBtn">Discard</button>
        </div>
    </div>
</div>
 */
import PAGEROUTER from "../Tools/pageRouter.js";


const renderMainPage = ()=>{
    const renderShop = ()=>{
        console.log();
    };
    const renderMainPage = ()=>{
        console.log();
    };
    const init = ()=>{
        // 메인페이지에서 shop으로 넘어가는 페이지라우터 설정.
        const mainToShopBtn = document.getElementById("mainToShopBtn");
        mainToShopBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("SHOP");
        });

    };
    return{
        init,
        renderMainPage,
        renderShop
    }
};

const MAIN_PAGE_RENDERER = renderMainPage();
export default MAIN_PAGE_RENDERER;  