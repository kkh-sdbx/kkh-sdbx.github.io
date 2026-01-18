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
    

    const setEventTarget = (eventTarget)=>{
            

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
        storageUpdate,
        setUserStorage

        

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
