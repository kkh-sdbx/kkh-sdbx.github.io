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
        
        let botsToAdd = 20;
        const botPartyMade = [];
        while (true){
            let toAdd ;
            if(botsToAdd > 0){

                botsToAdd > 5 ? toAdd = Math.floor(Math.random()*6)+1 : toAdd = Math.floor(Math.random()*botsToAdd)+1;
                const botParty = {
                    "leader":"", // 여러 명이 동시에 큐 신청할 때 대비
                    "size":0,
                    "members":[]
                };

                for(let i=0;i<toAdd;i++){
                    botParty.members.push(`bot${botsToAdd-i}`);
                };

                botParty.leader = botParty.members[0];
                botParty.size = botParty.members.length;
                botPartyMade.push(botParty);
                botsToAdd -= toAdd;
            }else{
                break;
            }; 
                
        };
        console.log("botsToAdd: ",botsToAdd,"botPartyMade: ",botPartyMade);
        

        
    };

    return{
        appendPrisoner
    };

};

const MATCHMAKING = matchMaking_Method();
export default MATCHMAKING;