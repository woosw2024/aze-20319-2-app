
//Module Require
//const mysql = require("mysql2/promise");
import mysql from 'mysql2';
import dotenv from "dotenv";
dotenv.config(); //env로 가져 온다 env는 서버에 올라 가면 안된다

//require("dotenv").config(); 

//DB 정보 선언 입니다
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  module.exports = db;  


