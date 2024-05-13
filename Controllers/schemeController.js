import { db } from "../Database/dbConnect.js";

export const list = async (req, res) => {
    
    try {
        const output = await db.query("select * from scheme");
        
        if (output.rowCount > 0) {
            return res.status(200).json({
                data: output.rows[0]
            })
        }
        else {
            return res.status(404).json({
                message: "There is no scheme available now"
            })
        }

    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            error: err
        })
    }

}