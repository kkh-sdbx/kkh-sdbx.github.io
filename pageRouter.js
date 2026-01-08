let PAGES = null;
let current = null;


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

        }else{
            console.warn(`wrong page name: ${pageName}`);

        }



    }

};

export default PAGEROUTER