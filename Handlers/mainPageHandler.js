import PAGEROUTER from "../Tools/pageRouter.js";
import VIEW from "../Visual/mainPageRenderer.js";

const MAINPAGE = {
    init(){
        const mainToGlobalBtn = document.getElementById("mainToGlobalBtn");
        const mainToLocalBtn = document.getElementById("mainToLocalBtn");
        const currentSkin = document.getElementById("currentSkin");
        // ## skinsMap 같은 걸 쓰지 말고, game_skins에 있는 css로직을 그대로 갖고 오면 된다.
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

        // ## currentSkin 클릭하고 mouseleave하면 사각형이 회전한다. css 조건이 잘못 짜여 있는거지.
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


