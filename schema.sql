-- create a database called companyDB
CREATE database companyDB;

USE companyDB;
-- create a table called department,primary key on id
CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);
-- create a table called role,primary key on id
CREATE TABLE role(
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10,4),
  department_id INTEGER NOT NULL,
  
  PRIMARY KEY (id)
);
-- create a table called employee, primary key on id
CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  
  PRIMARY KEY (id)
);
