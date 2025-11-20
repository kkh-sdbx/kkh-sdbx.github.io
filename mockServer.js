console.log("mock server");

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
class User{
    constructor(userNum){
        this.name = `user${userNum}`;
        this.kickTickets = 3;
        this.points = new Map([["point1",null],["point2",null],["point3",null],["point4",null],["point5",null]]);
        this.actions = new Map([["point1","Y"],["point2","Y"],["point3","Y"],["point4","Y"],["point5","Y"]]);
    }
    YES(pointNum){
        this.actions.set(`point${pointNum}`,"Y");        
    }
    NO(pointNum){
        this.actions.set(`point${pointNum}`,"N");
    }
    KICK(pointNum){
        this.actions.set(`point${pointNum}`,"K");
    }
}

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
const users = new Map();

/**
 * 사용자 클래스 정의
 */
class User {
    /**
     * @param {number} id 사용자 고유 ID
     * @param {Set<number>} friends 친구 ID 목록 (최대 5명)
     * @param {Map<number, 'like' | 'hate'>} interactions 친구와의 상호작용 기록
     */
    constructor(id) {
        this.id = id;
        this.friends = new Set();
        this.interactions = new Map();
    }
}

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

