import PAGEROUTER from "../Tools/pageRouter.js";

const LOADINGPAGE = {
    init(){
        const loadingToMainBtn = document.getElementById("loadingToMainBtn");
        loadingToMainBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });

    }

}

export default LOADINGPAGE