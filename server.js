import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.get('/users', (req,res)=>{
    const sql = "SELECT * FROM tbl_login";
    db.query(sql,(err,result)=>{
        if(err) return res.json({Error:"การเรียกข้อมูล User มีปัญหา"});
        return res.json(result);
    });
})

app.post('/register', (req,res) => {
    const sql = "INSERT INTO tbl_login (`name`,`email`,`password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, result) => {
        if(err) return res.json({Error:"การอินเสิรทข้อมูลมีปัญหาบน Server"});
        return res.json({Status: "Success"});
    });
})

app.post('/login',(req,res)=>{
    const sql = "SELECT * FROM tbl_login WHERE email = ? AND password = ?";
    db.query(sql,[req.body.email,req.body.password],(err,result)=>{
        // if(err) return res.json({Status:"Error"});
        if(result.length > 0){
            return res.json({Status: "Success"});
            
        }else{
            return res.json({Status:"Error"});
        }
        
    })
})

app.listen(8081, ()=> {
    console.log("Running at port 8081..");
})