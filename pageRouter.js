let PAGES = null;
const PAGEROUTER = {
    moveToPage(pageName){
        if(!PAGES){
                    PAGES = {
                        "ALL":document.querySelectorAll(".page"),
                        "LOADING": document.getElementById("loadingPage"),    
                        "MAIN": document.getElementById("mainPage"),
                        "GLOBAL": document.getElementById("globalMode"),
                        "LOCAL": document.getElementById("localMode")
                    }

                }

                PAGES.ALL.forEach((page)=>{
                    page.classList.remove("current");
                })

                PAGES[pageName]? PAGES[pageName].classList.add("current") : console.warn(`wrong page name: ${pageName}`);

            }

}

export default PAGEROUTER