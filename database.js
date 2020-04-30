const mysql = require('mysql2/promise')
const inquirer = require("inquirer");
const cTable = require('console.table');

let connnection
main()
async function main () {
  try {
    await connect()
    await createRecord()
  } catch (err) {
    console.error(err)
  } finally {
    connection.end()
  }
}

async function connect () {
  connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gjq.19901011',
    database: 'companydb'
  })
  console.log('Connected to MySQL as id: ' + connection.threadId)
}


/**
 * CRUD
 * C - CREATE - INSERT INTO pets (name, type, age) VALUES ("fido", "dog", 3);
 * R - READ   - SELECT * FROM pets;
 * U - UPDATE - UPDATE pets SET name="under dog" WHERE type = "dog";
 * D - DELETE - DELETE FROM pets WHERE type = "mouse";
 * 
Build a command-line application that at a minimum allows the user to:

Add departments, roles, employees

View departments, roles, employees

Update employee roles

Bonus points if you're able to:

Update employee managers

View employees by manager

Delete departments, roles, and employees

View the total utilized budget of a department -- ie the combined salaries of all employees in that department


 */


 
async function createRecord () {

    let questionObj = await inquirer.prompt([{
        type: 'list', 
        message: `What would you like to do?`,
        name: 'tableName',
        choices: ['View All Employee','View All Employee by Role','View All Employee by Department','Add Employee','Remove Employee','Update Employee Role', 'Update Employee Manager']
        }])


    // depending on the table, ask more questions
    switch(questionObj.tableName){
        case 'View All Employee': 
          let recordsVAE = await findAllEmployee()
          console.table(records)
          break;

        case 'View All Employee by Role': 
          let selectionOptions = await findAllRoleType();
          console.log(selectionOptions)
          let questionObj = await inquirer.prompt([{
            type: 'list', 
            message: `What would you like to do?`,
            name: 'roleType',
            choices: selectionOptions
            }])
          console.log(questionObj.roleType)
          let recordsVAER = await findAllEmployeeByRole(questionObj.roleType)
          console.table(recordsVAER)
          break;
            // let employeeQuestion = await inquirer.prompt([{
            //     message: `Please enter the new employee first name`,
            //     name: 'employeeFirstname'
            //     },
            //     {
            //     message: `Please enter the new employee last name`,
            //     name: 'employeeLastname'
            //     },
            //     {
            //     message: `Please enter the new employee's role`,
            //     name: 'employeeTitle'
            //     },
            //     {
            //         message: `Please enter the new employee's Manager`,
            //         name: 'employeeManager'
            //     }])
            
        case 'View All Employee by Department':
            let roleQuestion = await inquirer.prompt([{
                message: `Please enter the new role's title`,
                name: 'roleTitle'
                },
                {
                message: `Please enter the new role's salary`,
                name: 'roleSalary'
                }])

            recordObj = {
                title: roleQuestion.title,
                salary: roleQuestion.salary
            }
            break;
        }

  }


async function findAllEmployee(){
  const [rows] = await connection.query('SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, r.salary as Salary, d.name as Department, CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on d.id = r.department_id LEFT JOIN employee eManager on eManager.id = e.manager_id')
  return rows
}

async function findAllRoleType(){
  const [rows] = await connection.query('SELECT title FROM role')
  return rows.map(row => row.title)
}

async function findAllEmployeeByRole(roleType){
  console.log(roleType)
  const [rows] = await connection.query(`SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, r.salary as Salary, d.name as Department, CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on d.id = r.department_id LEFT JOIN employee eManager on eManager.id = e.manager_id WHERE Title = "${roleType}"`)
  return rows
}

async function findSongsByArtist () {

    let questionObj = await inquirer.prompt([{
        message: `Which Artist you would like to find?`,
        name: 'artistName'
        }])

    const [rows] = await connection.query('SELECT * FROM top5000 WHERE ?', {
      artist: questionObj.artistName
    })
    console.log(rows, '\n')
  }

async function findArtistsMoreThanOnce () {
    const [rows] = await connection.query('SELECT artist FROM top5000 GROUP BY artist HAVING COUNT(artist) > 1;')
    console.log(rows, '\n')
  }

async function findRawTotalGreaterThan () {

    let questionObj = await inquirer.prompt([{
        message: `Find artist with a raw record number of ..?`,
        name: 'rawRecord'
        }])

    const [rows] = await connection.query(`SELECT * FROM top5000 WHERE raw_total > ${questionObj.rawRecord}`)
    // select position.song.artist.year FROM top5000 WHERE position BETWEEN 45 AND 55;
    console.log(rows, '\n')
  }

  async function findSoung () {

    let questionObj = await inquirer.prompt([{
        message: `Which Song you would like to find?`,
        name: 'songName'
        }])

    const [rows] = await connection.query(`SELECT * FROM top5000 WHERE song LIKE '%${questionObj.songName}%'` )
      console.log(rows, '\n')
  }