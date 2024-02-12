const addSystemLogs=(req,res,action,action_type)=>{

    req.mysql.query("insert into systemlogs(user_ID,action,action_type) values(?,?,?)",[req.user.user_id,action,action_type],(err,results)=>{
        if(err){

            return res.status(500).json({"error":"Internal server error",success:false})
        }
       res.json({message:"Transaction Saved",success:true})
    })

}

export default addSystemLogs;