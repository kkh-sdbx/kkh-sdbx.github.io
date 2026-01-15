import PAGEROUTER from "../Tools/pageRouter.js";

const MAINPAGE = {
    init(){
        const mainToGlobalBtn = document.getElementById("mainToGlobalBtn");
        const mainToLocalBtn = document.getElementById("mainToLocalBtn");
        const currentSkin = document.getElementById("currentSkin");
        const skinStateMap = new Map([
            [undefined, "activated"],   // 클래스 없음 -> activated
            ["activated", "decided"],   // activated -> decided
            ["decided", undefined]      // decided -> 초기화 (필요시 추가)
        ]);


        mainToLocalBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("LOCAL");
        });


        mainToGlobalBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("GLOBAL");
        });

        currentSkin.addEventListener("click",()=>{
            let currentState = currentSkin.classList[0]; // nodeList형태와 비슷.
            let nextState = skinStateMap.get(currentState);
            currentSkin.className = "";

            if(nextState){
                currentSkin.classList.add(nextState);
            }
        });

    }
    

}

export default MAINPAGE


