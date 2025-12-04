console.log("mock server");
console.log(storage);

const ALLUSERS = new Map();
const setDummyActions = document.getElementById("setDummyActions");
const startMatchMaking = document.getElementById("startMatchMaking");

setDummyActions.addEventListener("click",()=>{
    ALLUSERS.forEach(( userInfo, userName )=>{
        if(userInfo.userType === "dummy"){
            setRandomActions(userInfo);
        }
        
    });
    console.log("actions Set:", ALLUSERS);
    // dummy user만 세팅하는 버튼이라서, 이 버튼을 눌러두고 fix해야 한다. 일단 지금은 이렇게 가.
    // Kick의 갯수가 정해져 있다면서? 그건 어떻게 체크할거임? 클라이언트 변조 가능성이 있잖아.

});

startMatchMaking.addEventListener("click",()=>{
    //1. 일단은, 모두 Y인 곳에서
    matchMaking(ALLUSERS);

});


function matchMaking(userPool){
    console.log("Phase1 starts - matchMaking started, Pool is:  ", userPool);
    const matchMakingPool = [];

    // 1. playerId - emptySlots 형태의 object 구조로 array 배열

    for(const userInfo of userPool){
        // user === ["dummy1", User]
        let result = {"name":userInfo[0],"emptySlots":[]}; // "dummy1"
        let currentPointStatus = userInfo[1].points //Map 형태로 저장된 point_1 ~ point_5
        for(const point of currentPointStatus){
            if (point[1]){
                continue
            }else{
                result.emptySlots.push(point[0]);

            }

        }
        console.log(result);  
        matchMakingPool.push(result);

    }


    // 2. array.forEach(=> i=0부터 array[i][j]와  array[i+1][j], array[i+2][j]..로 빈 칸을 찾아나가고, 슬롯 하나씩 이어 나감)
    console.log("Phase2 starts - matchMakingPool: ", matchMakingPool);


    // 3. 


    // 일단 빈 칸들 확인




}

class User{
    constructor(userNum, type){
        this.name = `user${userNum}`;
        this.kickTickets = 3;
        this.points = new Map([["point_1",null],["point_2",null],["point_3",null],["point_4",null],["point_5",null]]);
        this.actions = new Map([["point_1","Y"],["point_2","Y"],["point_3","Y"],["point_4","Y"],["point_5","Y"]]);
        this.userType = type;
    }
    YES(pointNum){
        this.actions.set(`point_${pointNum}`,"Y");        
    }
    NO(pointNum){
        this.actions.set(`point_${pointNum}`,"N");
    }
    KICK(pointNum){
        this.actions.set(`point_${pointNum}`,"K");
    }
    setId(userId){
        this.id = userId;
    }

}

document.addEventListener("actionFixed",(e)=>{

    // add New User(client)
    console.log(e);
    const activePoints = 5;
    let userNo= ALLUSERS.size;
    let newbie = new User(userNo, "player");
    newbie.setId(e.detail.clientX);
    for(let i=1; i<activePoints+1 ;i++){ // point가 5개가 아닐 수도 있다.
        newbie.actions.set(`point_${i}`,e.detail[`point_${i}`]);
    }
    ALLUSERS.set(userNo, newbie);
    console.log(ALLUSERS);

    //matchMaking
    matchMaking(ALLUSERS);
});

function pushDummyUsers(dummies){
    for(let i=1;i<dummies+1;i++){
        let dummy = new User(i, "dummy"); // 1,3,5,7,9...가 되는데 왜지?
        let dummyId = `dummy${i}`;
        dummy.setId(dummyId);
        ALLUSERS.set(`dummy${i}`, dummy);    
    }
}
pushDummyUsers(20);

function setRandomActions(dummyUser){
    // User.YES NO KICK 3개의 메소드가 있다.
    const actionPool = ["YES","NO","KICK"];
    let todo = actionPool[Math.floor(Math.random()*3)];
    for(let i=1; i<6; i++){
        dummyUser[todo](i);
        todo = actionPool[Math.floor(Math.random()*3)];
    }    

}







// # Proceed, Discard 시의 행동과
// ## 
// ### 
// #### 
// ##### Modal 텍스트 등 레이아웃 => 이건 나중에!
// 



















/*
const point_1 = document.getElementById("point_1");
const point_2 = document.getElementById("point_2");
const point_3 = document.getElementById("point_3");
const point_4 = document.getElementById("point_4");
const point_5 = document.getElementById("point_5");

const points = document.querySelectorAll('.point');
const tooltip = document.getElementById('global-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipBody = document.getElementById('tooltip-body');

const selection = document.getElementById('selectionPanel');
const YBtn = document.getElementById('YBtn');
const NBtn = document.getElementById('NBtn');
const KBtn = document.getElementById('KBtn');
*/



// 서버에 뭐가 있어야 하는지를 구상해 봐,
/**
 * tick => N시간마다 갱신.
 * 
 * botX => 숫자 맞춰서 봇을 만들어 줘야 함.
 * 
 * opnt => 일단 가상의 서버니까, opnt를 Kick할 경우에 대비해 bot 만들어주는 함수,
 * 
 * showDown => 
 * 
 * const player = {
 * "id":"xxxx",
 * "currentPoint": 00000,
 * "actions":{"point_1":"Y","point_2":"Y","point_3":"Y","point_4":"Y","point_5":"Y" },
 * 각 point는... 일단 비어있는지 아닌지를 확인해야 함.
 * 
 * 
 * }
 * 매치메이킹 알고리즘이 핵심일텐데...
 * 
## 내가 짜둔 코드##

function fillUserPool(N){
    const pool = [];
    for(let i=1;i<N+1;i++){
        let newUser = new User(i);
        pool.push(newUser);
    }
    return pool
}

const startingUserPool = fillUserPool(20);
console.log(startingUserPool);

*/
/*
/**
 * @fileoverview 간단한 매치메이킹 서버 알고리즘 구현
 */

// 사용자 데이터를 저장할 전역 저장소 (데이터베이스 역할)


/**
 * 사용자 클래스 정의

/**
 * 더미 사용자 데이터 생성 및 초기화
 */
function initializeUsers() {
    // 10명의 사용자 생성
    for (let i = 1; i <= 10; i++) {
        users.set(i, new User(i));
    }
    // 초기 친구 관계 설정 (복잡성 때문에 자동 매칭 로직은 초기화 시점에 생략)
    console.log("초기 사용자 및 친구 데이터 생성 완료.");
}

/**
 * 새로운 친구를 매칭하는 함수
 * @param {number} userId 새로운 친구가 필요한 사용자 ID
 * @returns {number | null} 매칭된 새로운 친구 ID 또는 매칭 실패 시 null
 */
function findNewFriend(userId) {
    const user = users.get(userId);
    if (!user) return null;

    // 현재 친구 및 이미 상호작용한 사용자 ID 목록
    const excludedIds = new Set([...user.friends, ...user.interactions.keys(), userId]);

    // 전체 사용자 중에서 제외된 사용자를 제외한 후보 목록
    const potentialFriends = Array.from(users.keys()).filter(id => !excludedIds.has(id));

    // 무작위로 새로운 친구 선택
    if (potentialFriends.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialFriends.length);
        const newFriendId = potentialFriends[randomIndex];
        return newFriendId;
    } else {
        // 더 이상 매칭할 사람이 없는 경우
        return null;
    }
}

/**
 * 친구에게 'like' 또는 'hate' 메시지를 보내는 함수
 * @param {number} senderId 메시지를 보내는 사용자 ID
 * @param {number} receiverId 메시지를 받는 사용자 ID
 * @param {'like' | 'hate'} message 메시지 유형

function sendMessage(senderId, receiverId, message) {
    const sender = users.get(senderId);
    if (sender && sender.friends.has(receiverId)) {
        sender.interactions.set(receiverId, message);
        console.log(`${senderId}가 ${receiverId}에게 '${message}'를 보냈습니다.`);
    } else {
        console.log("잘못된 요청이거나 친구 관계가 아닙니다.");
    }
}


 * 친구 관계를 끊고 즉시 새로운 친구를 매칭하는 함수 (핵심 로직)
 * @param {number} userId 친구를 끊는 사용자 ID
 * @param {number} kickFriendId 끊을 친구 ID

function kickFriendAndMatchNew(userId, kickFriendId) {
    const user = users.get(userId);
    const kickedFriend = users.get(kickFriendId);

    if (user && user.friends.has(kickFriendId) && kickedFriend) {
        // 1. 친구 관계 끊기
        user.friends.delete(kickFriendId);
        kickedFriend.friends.delete(userId); // 양방향 관계 해제

        console.log(`${userId}와 ${kickFriendId}의 친구 관계가 끊어졌습니다.`);

        // 2. 즉시 새로운 친구 매칭
        const newFriendId = findNewFriend(userId);

        if (newFriendId) {
            // 3. 새로운 친구 관계 설정
            user.friends.add(newFriendId);
            users.get(newFriendId).friends.add(userId);
            console.log(`새로운 친구 ${newFriendId}가 ${userId}에게 매칭되었습니다.`);
        } else {
            console.log(`${userId}에게 매칭할 새로운 친구를 찾을 수 없습니다.`);
        }
    } else {
        console.log("잘못된 요청이거나 해당 사용자가 친구 목록에 없습니다.");
    }
}

// --- 예시 실행 ---

initializeUsers();

// 사용자 1에게 초기 친구 5명 매칭 (예시를 위해 수동 설정)
const user1 = users.get(1);
user1.friends.add(2);
user1.friends.add(3);
user1.friends.add(4);
user1.friends.add(5);
user1.friends.add(6);
[2, 3, 4, 5, 6].forEach(id => users.get(id).friends.add(1));

console.log(`\n현재 사용자 1의 친구 목록: ${Array.from(user1.friends)}`);

// 사용자 1이 친구 3에게 'hate' 메시지를 보냄
sendMessage(1, 3, 'hate');

// 사용자 1이 친구 3을 'kick' 함
kickFriendAndMatchNew(1, 3);

console.log(`\n업데이트된 사용자 1의 친구 목록: ${Array.from(user1.friends)}`);

// 사용자 1이 친구 4를 'kick' 함
kickFriendAndMatchNew(1, 4);
console.log(`업데이트된 사용자 1의 친구 목록: ${Array.from(user1.friends)}`);

*/

const fix = document.getElementById("fix");
// localStorage는 너무 위험한데? 그냥 콘솔만 켤 줄 알면
// localStorage를 DB라고 생각하고 코드를 작성해 보라고.

const TRUTH = {
    "point_1":null,
    "point_2":null,
    "point_3":null,
    "point_4":null,
    "point_5":null

}

