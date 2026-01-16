// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)
let xx;

const connectGlobalMode = ()=>{

    let storage = null;
    
    let G_sendInfoToServer = null;
    let G_updateActionsFromStorage = null;


    const init() = ()=>{
        storage = window.localStorage;

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
    }
    const setUserStorage = ()=>{
        storage.clear();
        storage.setItem("name","KH");
        storage.setItem("id","KH_ID");
        storage.setItem("status","not yet");
    };


    return{
        

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
