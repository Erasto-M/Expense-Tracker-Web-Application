const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const  cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();
const app = express();
const usersTB = 'users';
const expenseTB = 'expenses';
const budgetTB = 'budget';
const  secretKey = process.env.SECRET_KEY;
// console.log(`secret key: ${secretKey}`);


//use neccessary middlewares
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:  process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
});

//authentication token
const verifyToken = (req, res , next)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({message: 'Access Denied'});
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json('Access Denied');

    jwt.verify(token , secretKey,(err, user)=>{
        if(err) return res.status(403).json('Invalid Token');
        req.user_id = user.id;
        next();
    })
};

// creating connection to MYSQL database
db.connect((err)=>{
    if(err) return console.log(err);
    console.log('Database Connected...............');
    const createDB = `CREATE DATABASE IF NOT EXISTS ${process.id.MYSQL_DB}`;
    //create database
    db.query(createDB, (err)=>{
        if(err) return console.log(err);
        console.log(`Database ${process.env.MYSQL_DB} created successfully..`);
    
        //use database 
        const useDb = `USE ${process.env.MYSQL_DB}`;
        db.query(useDb , (err)=>{
            if(err) return console.log(err);
            console.log(`Database ${process.env.MYSQL_DB} checked `);
            //create users table 
            const usersTable = `CREATE TABLE  IF NOT EXISTS ${usersTB} (
            id INT AUTO_INCREMENT  PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(100) NOT NULL UNIQUE, 
            password VARCHAR(255) NOT NULL
            )`;
            db.query(usersTable, (err)=>{
                if(err) return console.log(err);
                console.log(`${usersTB}  table created`);
            });
            // create expenses table 
            const expenses = `CREATE TABLE IF NOT EXISTS ${expenseTB}(
             id INT AUTO_INCREMENT PRIMARY KEY,
             user_id INT , 
             expenseName VARCHAR(100) NOT NULL,
             amount DECIMAL NOT NULL ,
             category VARCHAR(100) NOT NULL, 
             date DATE NOT NULL, 
             FOREIGN KEY(user_id) REFERENCES ${usersTB}(id)
            )`;
            db.query(expenses, (err)=>{
                if(err) return console.log(err);
                console.log(`${expenseTB} table created `);
            });

             //create Budget table 
             const budgetTable = `CREATE TABLE  IF NOT EXISTS ${budgetTB} (
                id INT AUTO_INCREMENT  PRIMARY KEY,
                user_id INT , 
                amount DECIMAL NOT NULL,
                FOREIGN KEY(user_id) REFERENCES ${usersTB}(id)
                )`;
                db.query(budgetTable, (err)=>{
                    if(err) return console.log(err);
                    console.log(`${budgetTB}  table created`);
                });
        });
    });
});

// register user endpoint (api/register)
app.post('/api/register', async(req, res)=>{
    try{
     const {email , username , password} = req.body;
     if(!email || !username || !password){
        return res.status(400).json({message: 'All fields are required'});
     }
     console.log('This are user details' , {email, username, password});
       //check whether email is already in use
    const userEmail = `SELECT * FROM ${usersTB} WHERE email = ?`;
    db.query(userEmail, [email] , (err , data)=>{  
       if(data.length>0) return res.status(409).json({message: 'User already exists'});
       // hashing password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password , salt);
        //creating new user
        const createNewUser = `INSERT INTO ${usersTB} (email , username , password) VALUES(?,?,?)`;
        const values = [email, username, hashedPassword];
        db.query(createNewUser, values, (err, data)=>{
            if(err) return res.status(500).json({message: 'Something went wrong', error: err.message});
            return res.status(200).json({message: 'User created successfully'});
        });
    });
    }catch(e){
        console.log(e);
        res.status(500).json('Internal Server error');
    }
});
//login user endpoint 
 app.post('/api/login' , async (req,res)=>{
   try{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json('All fields are required');
    }
    const userDetails = `SELECT * FROM ${usersTB} WHERE username = ?`;
    db.query(userDetails, [username] , (err, data)=>{
        if(err) return res.status(500).json('Something went worng');
        if(data.length === 0) return res.status(404).json('User not found');
        const user = data[0];
        console.log(user);
        if(!user.passWord){
            console.log('User password in not found');
        }
        const isPasswordValid = bcrypt.compareSync(password,data[0].passWord);
        if(!isPasswordValid) return res.status(400).json('Incorrect username or Password');
        const token = jwt.sign(
           {
            id: user.id, username: user.username
           },
           secretKey,
           {expiresIn: '1h'}
        );
        console.log("token", token);
        return res.status(201).json({message: 'Login successful', token});
    });
   } catch(e){
    console.log(e);
    res.status(500).json('Internal Server error');
   }
 });

 //get user profile info
 app.get('/api/userProfile', verifyToken, (req, res)=>{
   try{
    const id = req.user_id;
    if(!id) {
        return res.status(404).json({message: 'unAuthorized'});

    }
    const getuserProfile = `SELECT * FROM ${usersTB} WHERE id = ?`;
    db.query(getuserProfile, [id], (err, result)=>{
        if(err) return res.status(500).json({message: 'Somathing went wrong', error: err.message});
        return res.status(200).json({message: "Profile data fetched successfully", result: result});
    });
   }catch(err){
    return res.status(500).json({message: 'Something went wrong'});
   }
 });

 //logout user
 const blackList = new Set();
// Function to add a token to blackList
 const inValidateToken = (token)=>{
    blackList.add(token);
 };
 //Function to check if a token is BlackListed
 const isTokenBlackListed =(token) =>{
    return blackList.has(token);
 };
 //middleware to check blackListed Tokens
 const checkBlackList = (req, res, next) =>{
    const token = req.headers['authorization']?.split(' ')[1];
    if(token && isTokenBlackListed(token)){
        return res.status(401).json({message: "Token is BlackListed"});
    }
    next();
 };
 //use the middleware
 app.use('/api', checkBlackList);

 //logout with token invalidation
 app.post('/api/logout', (req, res)=>{
    try{
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return res.status(400).json({message: 'No token Provided'});
        }
        inValidateToken(token);
        res.status(200).json({message: 'Logged out SuccessFully'});
    }catch(err){
        //return res.status(500).json({message: 'Something went Wrong', error: err.message});
    }
 });
 //add expense
//Managing  expenses endpoints 
//add new expense endpoint 
app.post('/api/expenses/addexpense', verifyToken,(req, res)=>{
    try{
        const {amount,expenseName, date, category} = req.body;
        //validate user input
        if(!amount ||!expenseName || !date || !category){
            return res.status(400).json({message: 'All fields are required'});
        }
        //formatted date 
        function formatDate(inputDate){
            const [day, month, year] = inputDate.split('/');
            return `${year}-${month}-${day}`;
        }
        const formattedDate = formatDate(date);
        const addExpense = `INSERT INTO ${expenseTB}
        (user_id, expenseName, amount, date,category) VALUES(?,?,?,?,?)`;
        const values = [req.user_id,expenseName, amount,date,category];
        console.log('expense details', values);

        db.query(addExpense, values,(err, result)=>{
            if(err) {
                console.log('error', err);
                res.status(500).json({message: 'Something went wrong', error: err.message});
            }
            return res.status(201).json({message: 'Expense added successfully'});
        })
    }catch(e){
        return res.status(500).json({message: 'Something went wrong'});
    }
});

//get all user expenses endpoint

app.get('/api/expenses/getUserExpenses', verifyToken, (req, res)=>{
    try{
        const getUserExpenses = `SELECT * FROM ${expenseTB} WHERE user_id = ?`;
        db.query(getUserExpenses, [req.user_id], (err, result)=>{
            if(err) return res.status(500).json({message: 'Something went wrong'});
            return res.status(200).json({message: 'Expenses fetched successfully', expenses: result});
        })
    }catch(e){
        return res.status(500).json({message: 'Something went wrong'});
    }
});

//get exepenses by user id 
app.get('/api/expenses/getExpense/:id', verifyToken, (req, res)=>{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({message: 'All fields are required'});
    }
    const getExpenseById = `SELECT *FROM ${expenseTB} WHERE  user_id= ?`;
    db.query(getExpenseById, [id], (err, result)=>{
        if(err) return res.status(500).json({message: 'Something went wrong', error: err.message});
        if(result.length === 0){
            return res.status(404).json({message: 'Expense not found or unAuthorized'});
        }
      return res.status(200).json({message: 'Expense fetched successfully', expense: result});
});});

//update existing user expenses using id to specific expense
app.put('/api/expenses/updateExpenses/:id', verifyToken, (req, res)=>{
    try{
        const id = req.params.id;
    const {amount,expenseName, category, date} = req.body;
    if(!id||!amount ||!expenseName|| !date ||!category){
        return res.status(400).json({message: 'All fields are required'});
    }
    //formatted date 
    function formatDate(inputDate){
        const [day, month, year] = inputDate.split('/');
        return `${year}-${month}-${day}`;
    }
    const formattedDate = formatDate(date);
    //log items to be updated
    console.log('Update values:', { id, amount,expenseName, category, formattedDate, user_id: req.user_id });
    // expenses
    const updateQuery = `UPDATE ${expenseTB} 
    SET amount = ?, category = ? , date = ?   WHERE 
    id = ? AND  user_id = ?
    `;
    const values = [amount,category,expenseName,formattedDate,id, req.user_id];
    db.query(updateQuery, values, (err, result)=>{
        if(err) return res.status(500).json({message: 'something went wrong', error: err.message});
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Expense not found or unAuthorized'});
        }
        return res.status(200).json({message : 'Expense updated successfully'});
    });
    }catch(err){
        return res.status(500).json({message: 'Something went wrong', error: err.message});
    }
});

//delete expense endpoint
app.delete('/api/expenses/deleteExpense/:id', verifyToken,(req, res)=>{
     try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message: 'All fields are required'});
        }
        console.log('Delete values:', { id, user_id: req.user_id });
        const deleteQuery = `DELETE FROM ${expenseTB} WHERE id = ? AND user_id = ?`;
        db.query(deleteQuery,[id, req.user_id], (err, result)=>{
            if(err) return res.status(500).json({message: 'Something went wrong', error: err.message});
            if(result.affectedRows === 0){
                return res.status(404).json({message: 'Expense not found or unAuthorized'});
            }
            return res.status(200).json({message: 'Expense deleted successfully'});
        });
     }catch(e){
        return res.status(500).json({message: 'Something went wrong', error: e.message});
     }
});

//get expenses total where id = user id
app.get('/api/expenses/getTotalExpenses' , verifyToken , (req, res)=>{
   try{
    const id = req.user_id;
    if(!id){
        return res.status(401).json({message: 'Anuthorized'});
    }
    const getTotalExpenses = `SELECT   SUM(amount) as totalAmount FROM ${expenseTB} WHERE user_id = ?`;
    db.query(getTotalExpenses, [id] , (err, result)=>{
        if(err) return res.status(500).json({message: "Something went Wrong", error: err});
        return res.status(200).json({message: "Total fetched Successfully", result: result});
    });
   }catch(e){
    return res.status(500).json({message: "Internal Server error", error: e});
   }
});

//calculate total expenses based on expense records
app.get('/api/expenses/getTotalExpensesByCategory',verifyToken, (req, res)=>{
    try{
        const getTotalExpensesByCategory = `
        SELECT category, SUM(amount) as 
        totalAmount FROM ${expenseTB}
        WHERE user_id = ? GROUP BY category`;
        db.query(getTotalExpensesByCategory, [req.user_id], (err, result)=>{
            if(err) return res.status(500).json({message: 'Something went wrong', error: err.message});
            return res.status(200).json({message: 'Total expenses fetched successfully', totalExpenses: result});
        });

    }catch(err){
        return res.status(500).json({message: 'Something went wrong', error: err.message});
    }
});

//Set Budget
app.post('/api/budget/setBudget',verifyToken, async (req, res)=>{
    try{
        const {amount} = req.body;
        if(!amount){
            return res.status(400).json({message: "All fields are required"});
        }
        //confirm whether the user already has a budget
        const userBudget = `SELECT * FROM ${budgetTB} WHERE user_id = ?`;
        db.query(userBudget, [req.user_id], (err, result)=>{
            if(err) return res.status(500).json({message: 'Something went wrong', error: err.message});
            if(result.length > 0){
                const updateBudget = `UPDATE ${budgetTB} SET amount = ? WHERE user_id = ?`;
                db.query(updateBudget, [amount, req.user_id], (err, result)=>{
                    if(err) return res.status(500).json({message: 'Something went wrong', error: err.message});
                    return res.status(200).json({message: 'Budget updated successfully', result: result});
                });
            } 
            else {
                 //set user budget
            const setBudget = `INSERT INTO ${budgetTB}(user_id, amount) VALUES(?,?)`;
            db.query(setBudget, [req.user_id, amount], (err, result)=>{
             if(err) return res.status(500).json({message: 'Something went wrong', error: e.message});
             return  res.status(200).json({message: "Budget Set Successfully", result: result});
         });
            }
           
        });
    }catch(e){
        return res.status(500).json({message: 'Something went wrong', error: e.message});
    }
});

//get user budget
app.get('/api/budget/getBudget', verifyToken, (req, res)=>{
    try{
        const getUserBudget = `SELECT amount FROM ${budgetTB} WHERE user_id = ?`;
        db.query(getUserBudget, [req.user_id] , (err, result)=>{
            if(err) return res.status(500).json({message: "Somathing went wrong", error : err.message});
            if(result.length === 0){
                return res.status(404).json({message: " Budget Not found"});
            }
            return res.status(200).json({message: 'Budget Fetched Successfully', budget: result[0].amount});
        });
    }catch(err){
        return res.status(500).json({message: "Somathing went wrong", error : err.message});
    }
});

// server port listening
app.listen(process.env.PORT, ()=>{
    console.log(`Server running at port ${process.env.PORT}`);
});