import {db} from "../Database/dbConnect.js";

export const list_sent_transaction=async(req,res)=>{
const {customer_id}=req.body;


  const is_any_transaction=await db.query("select * from transaction_details where from_id in (select account_id from bank_account where customer_id = $1)",[customer_id]);
  // console.log(is_any_transaction);
  if(is_any_transaction.rowCount===0)
    return res.status(200).json({message:"This customer has not sent any transaction "});
  res.status(200).json({message:`Customer\'s Transactions are :`,data: is_any_transaction.rows});
  
};

export const list_received_transaction=async(req,res)=>{
  const {customer_id}=req.body;
  
  
    const is_any_transaction=await db.query("select * from transaction_details where to_id in (select account_id from bank_account where customer_id = $1)",[customer_id]);
    // console.log(is_any_transaction);
    if(is_any_transaction.rowCount===0)
      return res.status(200).json({message:"This customer has not received any transaction "});
    res.status(200).json({message:`Customer\'s Transactions are :`,data: is_any_transaction.rows});
    
  };
export const transaction_in_bank = async (req,res)=>{


  const { from_acc_id, to_acc_id, amount, note } = req.body;
  
    try {
      // Check sender and receiver account existence in a single query
      const accounts = await db.query(
        `SELECT from_account.balance AS sender_balance,
                 to_account.account_id AS receiver_id
          FROM bank_account AS from_account
          JOIN bank_account AS to_account ON to_account.account_id = $2
          WHERE from_account.account_id = $1`,
        [from_acc_id, to_acc_id]
      );
  
      if (accounts.rowCount === 0) {
        // Handle both sender and receiver account not found
        return res.status(404).json({ message: "Sender's or receiver's bank account doesn't exist" });
      }
  
      const { sender_balance } = accounts.rows[0];
  
      if (sender_balance < amount) {
        return res.status(400).json({ message: "Insufficient balance to transfer amount" });
      }
  
      // Update sender and receiver balances (assuming a single transaction)
      const updateSender = await db.query(
        `UPDATE bank_account
         SET balance = balance - $1
         WHERE account_id = $2`,
        [amount, from_acc_id]
      );
  
      const updateReceiver = await db.query(
        `UPDATE bank_account
         SET balance = balance + $1
         WHERE account_id = $2`,
        [amount, to_acc_id]
      );
  
      if (updateSender.rowCount === 0 || updateReceiver.rowCount === 0) {
       return  res.status(500).json({ message: "Transaction failed. Please try again later." });
      }
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date (YYYY-MM-DD)
        
      const transaction=await db.query("insert into transaction_details values ($1,$2,$3,$4,$5)",[from_acc_id,to_acc_id,amount,currentDate,note]);
      
      res.status(200).json({ message: `Successfully transferred Rs.${amount} from ${to_acc_id} to account ${to_acc_id}` });
    } catch (error) {
      console.error('Error during transaction:', error);
      res.status(500).json({ message: "Transaction failed. Please try again later." }); 
    }
  };
  
    // const {from_acc_id,to_acc_id,amount,note}=req.body;
    // let sender_acc= await db.query("select 1 from bank_account where account_id = $1",[from_acc_id]);
    // let receiver_acc= await db.query("select 1 from bank_account where account_id = $1",[to_acc_id]);

    // if(receiver_acc.rowCount==0)
    //   {
    //     res.status(404).json({message:"Receiver\'s Bank account doesn't exists"})
    //   }
    
    //   if(sender_acc.rowCount==0)
    //     {
    //       res.status(404).json({message:"Sender\'s Bank account doesn't exists"})
    //     }
    //     sender_acc= await db.query("select balance from bank_account where account_id = $1",[from_acc_id]);
    //     receiver_acc= await db.query("select balance from bank_account where account_id = $1",[to_acc_id]);
    //     console.log(sender_acc);
    //     const { balance}=sender_acc.rows[0];
    //     res.json(balance);
    //      if(balance < amount)
    //       {
    //         res.status(400).json({message:"insufficient balance to transfer amount"});
    //       }
    

// }; 

export const delete_bank_acc = async(req,res)=>{
    try{
    const {account_id}=req.body;
    const is_available= await db.query("select 1 from bank_account where account_id = $1",[account_id]);
    if(is_available.rowCount==0)
        {
           return res.status(404).json({message:"Bank account doesn't exists"})
        }
        const balance =await db.query("select balance from bank_account  where account_id =$1",[account_id]);
        console.log(balance);
    const del_acc= await db.query("delete from bank_account where account_id =$1",[account_id]);
        res.status(200).json({message:"Bank Account deleted successfully, Collect the Account balanace as cash from post office ",...balance.rows});
}
catch(err){}
  
};


export const create_bank_acc =async (req,res)=>{

// Function to generate a unique 10-digit bank account number
async function generateUniqueBankAccountNumber() {
  let uniqueNumber;
  do {
    // Generate a random 10-digit number
    uniqueNumber = Math.floor(Math.random() * 10000000000);
  } while (await isAccountNumberInUse(uniqueNumber)); // Check for uniqueness

  return uniqueNumber.toString().padStart(10, '0'); // Ensure 10 digits, prepend zeros
}

// Function to check if a bank account number already exists
async function isAccountNumberInUse(accountNumber) {
  try {
    //const client = await db.connect();
    const result = await db.query('SELECT 1 FROM bank_account WHERE account_id = $1', [accountNumber]);
   // db.release();
    return result.rows.length > 0; // True if the number exists
  } catch (error) {
    // console.error('Error checking for duplicate account number:', error);
    // throw error; // Re-throw the error for handling in the route
  }
}

// Route to create a new bank account record
  const { email,deposit } = req.body; 
 
  let user = await db.query("SELECT id FROM account WHERE username = $1", [
    email,
  ]);
  //console.log(user.rows);
  let detail = user.rowCount;
  const { id }=user.rows[0];
  //console.log(id);
  // let count = await db.query("SELECT count(*) FROM account GROUP BY id");

  // let count1 = count.rowCount;
  // console.log(count1);console.log(count);
  // console.log(detail);
  if (detail) {
  

    try {   

        const currentDate = new Date().toISOString().slice(0, 10); // Get current date (YYYY-MM-DD)
        
        // let cid=await db.query("select ")
  // let is_table_empty =await db.query("select * from bank_account");
 // if(is_table_empty.rowCount <1){
        const accountNumber = await generateUniqueBankAccountNumber();
        //const client = await pool.connect();
       // await db.query('INSERT INTO bank_account (account_id, date_of_creating ,customer_id ) VALUES ($1, $2, $3)',
        //  [accountNumber,currentDate , count1+1]);
       // db.release();
 // }
 // else {
    // const accountNumber = await generateUniqueBankAccountNumber();
    //     //const client = await pool.connect();
        await db.query('INSERT INTO bank_account (balance,date_of_creating ,customer_id,account_id ) VALUES ($1, $2,$3,$4)',
          [deposit,currentDate , id,accountNumber]);
       // db.release();
  //}     
       // let accountNumber=db.query("select account_id from bank_account where customer_id = $1",[count1+1]);
        res.json({ message: 'Account created successfully!', accountNumber ,deposit});
      } catch (error) {
        console.error('Error creating bank account:', error);
        res.status(500).json({ message: 'Error creating account, please try again later.' });
      }


}

else {
    res.status(500).json({ message: 'Error creating account, Cuistomer id doesn\'t exist. Create a customer Account to further preoceed to create a bank account' });

}
};


