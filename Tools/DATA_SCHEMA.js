
const SCHEMA = ()=>{
    
    const prisonerData = ()=>{
        const prisoner = {
            "PRISONER_NAME":"prisonerName",
            "PRISONER_TYPE":"prisonerType",
            "PRISONER_ID":"prisonerID",
            "PRISONER_GLOBAL_ACTIONS":
                {"G_point_1":null, 
                "G_point_2":null,
                "G_point_3":null,
                "G_point_4":null,
                "G_point_5":null}
            ,
            "PRISONER_GLOBAL_STATUS":{"status":"not yet","N":0,"Y":0,"K":0},
            "PRISONER_LOCAL_ACTIONS":
                {"L_point_1":null,
                "L_point_2":null,
                "L_point_3":null,
                "L_point_4":null,
                "L_point_5":null}
            ,
            "PRISONER_LOCAL_STATUS":{"status":"not yet","N":0,"Y":0,"K":0}
        }
        return prisoner
    
    };

    const GAME_PHASE = ()=>{
        /**resultTable은 서버에서 받아와 저장을 하든지 해야 한다. Connection에서 setSchema()도 있어야 할 듯. */
        const resultTable = {
        "YY": {"breakUp":false, "score":[4, 4]},   
        "YN": {"breakUp":false, "score":[-8, 8]},  
        "YK": {"breakUp":true, "score":[2, 0]},
        "NY": {"breakUp":false, "score":[8, -8]},  
        "NN": {"breakUp":false, "score":[-6, -6]}, //NN의 시차도 적용해야 함.
        "NK": {"breakUp":true, "score":[-2, 0]},
        "KY": {"breakUp":true, "score":[0, 2]},   
        "KN": {"breakUp":true, "score":[0, -2]},   
        "KK": {"breakUp":false, "score":[-12, -12]}
    }; 
        const playingPhase = new Map([
            ["commence","commencingFunctions"],
            ["selection","selectionFunctions"],
            ["sendingUltimatum","sendingUltimatumFunctions"],
            ["selection","selectionFunctions"]        
        ]);
        
        const resultPhase = new Map([
            ["showDown","showDownFunctions"],
            ["matchMaking","matchMakingFunctions"],
            ["ending","endingFunctions"]        
        ]);
        const game = {
            "rounds":0, //로컬은 13, 글로벌은 41
            "startingLife":0, // 로컬은 100, 글로벌은 ??
            "playingPhase": playingPhase,
            "resultPhase":resultPhase,
            "resultTable":resultTable
        }; 
        //new Map([]);

        return{
            game
        }
    };
    
    return{
        prisonerData,
        GAME_PHASE

    }

};

export default SCHEMA