import PAGEROUTER from "../Tools/pageRouter.js";

const LOADINGPAGE = {
    setRouter(){
        const loadingToMainBtn = document.getElementById("loadingToMainBtn");
        loadingToMainBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });

    }

}

export default LOADINGPAGE