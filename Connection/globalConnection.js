// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)


const connectGlobalMode = ()=>{

    let storage = null;

    let G_sendInfoToServer = null;
    let G_updateActionsFromStorage = null;

    let pointsEventTarget = null;
    let selectionEventTarget = null;
    let modalEventTarget = null;

    const setUserStorage = ()=>{
        storage.clear();
        storage.setItem("name","KH");
        storage.setItem("id","KH_ID");
        storage.setItem("status","not yet");
    };
    /**
     * @
     */
    const updateDecisionData = (decisionDetail)=>{
        
        // DECISION_DETAIL = {"target":G_currentPoint.id, "action":G_currentPoint.dataset.btnType };
        // 데이터가 변경되었음을 알림

        storage.setItem(`${decisionDetail.taget}`, `${decisionDetail.action}`); //=> RDB 구조를 짜야 할 시점이다. => 아직 아냐! G_,L_,S_만 구분해놓자.


        
    };    

    const handleFix = (eventTarget)=>{
        const checker = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];
            
                for(const point of checker){
                    if(storage[point] === undefined){
                        emptyPoints.push(point);
                    }
                }

                if(G_emptyPoints.length>0){
                    let empty =  "";
                    for (const mt of G_emptyPoints){
                        empty = empty + `, ${mt}`;
                    }
                    G_fixModal.style.display = "block";


                    console.log(`There are empty Points:${empty.slice(1)}. If you Proceed, these points will automatically filled with "Y". Wanna Proceed?`);
                }else{
                    
                    console.log("You cannot change your response after fixing. Wanna Proceed? ");
                    G_fixModal.style.display = "block";
                }

            });
            

    }

    const init = (eventTarget)=>{
        
        storage = window.localStorage;

        pointsEventTarget = eventTarget.pointsEventTarget;
        selectionEventTarget = eventTarget.selectionEventTarget;
        modalEventTarget = eventTarget.modalEventTarget;

        G_sendInfoToServer = new CustomEvent("actionFixed",{
            bubbles: true, // Allows the event to bubble up the DOM
            cancelable: false,
            detail:storage
            }
        );

        G_updateActionsFromStorage = new CustomEvent("storageUpdated",{
            bubbles:true,
            cancelable: false,
            detail:storage
        });

            
    };

    return{
        init,
        updateDecisionData,
        setUserStorage

        

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
