CREATE database companyDB;

USE companyDB;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  employee
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10,4),
  department_id INTEGER NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  
  PRIMARY KEY (id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

USE companyDB;
ALTER TABLE role;
ALTER COLUMN department_id INTEGER AUTO_INCREMENT NOT NULL;
