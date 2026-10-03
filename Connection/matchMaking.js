const WAITING_PRISONERS = new Map(); // 이렇게 선언하는 게 아니라? 일단 선언.

const matchMaking_Method = ()=>{

    // WAITING_PRISONERS에 유저 정보를 넣는 함수
    const appendPrisoner = (incomingPrisoner)=>{
        const party = {
            "leader":incomingPrisoner.prisonerID, // 여러 명이 동시에 큐 신청할 때 대비
            "size":1,
            "members":[]

        };
        party.members.push(incomingPrisoner.prisonerID);

        WAITING_PRISONERS.set(incomingPrisoner.prisonerID,incomingPrisoner);

        // ## 봇들을 mock해서 넣는 코드.
        // ## entryPoint: 20 bots를 1~6명씩 랜덤으로 파티로 묶어 넣는 코드 작성.
        for(let i=0;i<10;i++){
            const botParty = {
            "leader":`bot${i}`, // 여러 명이 동시에 큐 신청할 때 대비
            "size":1,
            "members":[]
            };
            botParty.members.push(`bot${i}`)
        };

        
    };

    return{
        appendPrisoner
    };

};

const MATCHMAKING = matchMaking_Method();
export default MATCHMAKING;