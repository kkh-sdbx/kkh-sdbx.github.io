// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)
let xx;

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
    const storageUpdate = (e)=>{
            for(let i=1;i<6;i++){ // point가 5개가 아닐 수도 있다.
                if(e.detail[`G_point_${i}`]){ // storage에 point별 action이 추가된 경우 업데이트
                    if(e.detail[`point_${i}`] === "Y"){
                        G_points[i-1].parentElement.classList.remove("kicked");
                        G_points[i-1].classList.add(e.detail[`point_${i}`]);
                        G_points[i-1].classList.add("decided");
                        G_points[i-1].previousElementSibling.classList.remove("picked");
                        G_points[i-1].nextElementSibling.classList.add("picked");
                    
                    }else if(e.detail[`G_point_${i}`] === "N"){
                        G_points[i-1].parentElement.classList.remove("kicked");
                        G_points[i-1].classList.add(e.detail[`point_${i}`]);
                        G_points[i-1].classList.add("decided");
                        G_points[i-1].previousElementSibling.classList.add("picked");
                        G_points[i-1].nextElementSibling.classList.remove("picked");

                    }else if(e.detail[`G_point_${i}`] === "K"){
                        G_points[i-1].parentElement.classList.add("kicked");
                        G_points[i-1].classList.add(e.detail[`point_${i}`]);
                        G_points[i-1].classList.add("decided");
                        G_points[i-1].previousElementSibling.classList.remove("picked");
                        G_points[i-1].nextElementSibling.classList.remove("picked");

                    }

                }else{ // showDown이후 storage에 point별 action이 삭제된 경우 업데이트
                    G_points[i-1].parentElement.classList.remove("kicked");
                    G_points[i-1].classList.remove("decided");
                    G_points[i-1].previousElementSibling.classList.remove("picked");
                    G_points[i-1].nextElementSibling.classList.remove("picked");
                };
                
            };
        };

        const setEventTarget(eventTarget){
            

        }

        const init(eventTarget) = ()=>{
        
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
