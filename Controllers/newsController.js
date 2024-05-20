import {db} from "../Database/dbConnect.js"

export const view_news=async(req,res)=>{

    try {
        const output = await db.query("select * from news");
        
        if (output.rowCount > 0) {
            return res.status(200).json({
                data: output.rows
            })
        }
        else {
            return res.status(404).json({
                message: "There is no news available now"
            })
        }

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: `${err}`
        })
    }

};


export const add_news=async(req,res)=>{
    const {news_type,news_info}=req.body;

    try{
    const add_new=await db.query("insert into news (news_type,news_info) values ($1,$2)",[news_type,news_info]);
    // const {news_id}
    res.status(200).json({message:"News added successfully"});
    }
    catch(e)
    {
        return res.status(500).json({
            message: "internal server error",
            error: `${e}`
        });
    }
};




export const remove_news=async(req,res)=>{
const{news_id}=req.body;

const is_available=await db.query("select * from news where news_id = $1",[news_id]);
if(is_available.rowCount===0)
    return res.status(404).json({message:`No news found with news id ${news_id}`});

await db.query("delete from news where news_id= $1",[news_id]);
res.status(200).json({message:"News deleted successfully "});

};