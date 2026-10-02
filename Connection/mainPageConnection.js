// ## 클라이언트 스토리지에서 데이터 가져오는 것도 Tool에 있어야 하지 않나?
const storage = window.localStorage;
console.log(storage);

const mainPageConnection = ()=>{

    const getUserInfo = ()=>{

        const userData = JSON.parse(storage.getItem("mockUserData")); 
        
        return userData;
    }



    return {
        getUserInfo
    }
};

const MAIN_PAGE_MODEL = mainPageConnection();
export default MAIN_PAGE_MODEL
