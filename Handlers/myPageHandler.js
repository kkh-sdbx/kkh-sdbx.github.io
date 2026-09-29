const myPage = ()=>{


    const init = (myPageData)=>{
        console.log("myPage initiated!: ",myPageData);
    };

    return{
        init
    };
};

const MY_PAGE = myPage();

export default MY_PAGE