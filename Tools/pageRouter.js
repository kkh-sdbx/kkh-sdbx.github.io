let PAGES = null;
let current = null;

// 결제 시 같은 경우, 페이지 이동을 막아야 할 필요도 있다.

const PAGEROUTER = {
    currentPage(){
        return current;
    },
    moveToPage(pageName){
        // "ALL" 예약어 호출 방지
        if (pageName === "ALL") {
            console.error("Cannot move to 'ALL' context.");
            return;
        }

        if(!PAGES){
            PAGES = {
                "ALLPAGES" : document.querySelectorAll(".page"),
                "LOADING": document.getElementById("loadingPage"),    
                "MAIN": document.getElementById("mainPage"),
                "GLOBAL": document.getElementById("globalMode"),
                "LOCAL": document.getElementById("localMode")
            };

        }

        PAGES.ALLPAGES.forEach((page)=>{
            page.classList.remove("current");
        });

        if(PAGES[pageName]){
            PAGES[pageName].classList.add("current");
            current = pageName;
            console.log("PAGE_ROUTER: current is-",current);

        }else{
            console.warn(`wrong page name: ${pageName}`);

        }

    }

};

export default PAGEROUTER