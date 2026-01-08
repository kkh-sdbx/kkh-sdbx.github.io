import PAGEROUTER from "../Tools/pageRouter.js";

const MAINPAGE = {
    setRouter(){
        const mainToGlobalBtn = document.getElementById("mainToGlobalBtn");
        const mainToLocalBtn = document.getElementById("mainToLocalBtn");


        mainToLocalBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("LOCAL");
        });


        mainToGlobalBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("GLOBAL");
        });

    }

}

export MAINPAGE


