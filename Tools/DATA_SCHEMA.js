
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
    
    }
    
    return{
        prisonerData

    }

};

export default SCHEMA