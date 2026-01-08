let PAGES = null;
const ALLPAGES = document.querySelectorAll(".page"); 
let current ;




const PAGEROUTER = {
    currentPage(){
        return current
    },
    moveToPage(pageName){
        if(!PAGES){
            PAGES = {
                "LOADING": document.getElementById("loadingPage"),    
                "MAIN": document.getElementById("mainPage"),
                "GLOBAL": document.getElementById("globalMode"),
                "LOCAL": document.getElementById("localMode")
            }

        }

        ALLPAGES.forEach((page)=>{
            page.classList.remove("current");
        });

        if(PAGES[pageName]){
            PAGES[target].classList.add("current")
                current = target;

        }else{
            console.warn(`wrong page name: ${pageName}`);

        }



    }

}

export default PAGEROUTER