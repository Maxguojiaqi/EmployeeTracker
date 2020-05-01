CREATE database companyDB;

USE companyDB;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10,4),
  department_id INTEGER NOT NULL,
  
  PRIMARY KEY (id)
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  
  PRIMARY KEY (id)
);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;

-- USE companyDB;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mike', 'Chan', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ashley', 'Rodriguez', 3, 0);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kevin', 'Tupik', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Malia', 'Brown', 5, 0);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sarah', 'Lourd', 6, 0);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tom', 'Allen', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Christian', 'Eckenrode', 3, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Person', 50000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 60000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Lead', 100000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Growth Hacker', 90000, 4);

INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Marketing');
