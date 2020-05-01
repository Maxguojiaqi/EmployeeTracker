const mysql = require('mysql2/promise')
const inquirer = require("inquirer");
const cTable = require('console.table');

let connnection
let allEmployeeInfo

main()
async function main () {
  try {
    await connect()
    allEmployeeInfo = await findAllEmployee()
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


    let keepLoop = true
    // depending on the table, ask more questions
    while(keepLoop)
    {
    let questionObj = await inquirer.prompt([{
      type: 'list', 
      message: `What would you like to do?`,
      name: 'tableName',
      choices: ['View All Employee','View All Employee by Role','View All Employee by Department','Add Employee','Remove Employee','Update Employee Role', 'Update Employee Manager']
      }])

    switch(questionObj.tableName){
        case 'View All Employee': 
          // let recordsVAE = await findAllEmployee()
          console.table(allEmployeeInfo)
          break;

        case 'View All Employee by Role': 
          let selectionOptionsRolewithID = await findAllRoleType();
          let selectionOptionsRole = selectionOptionsRolewithID.map(row => row.title)
          let questionVAER = await inquirer.prompt([{
            type: 'list', 
            message: `What would you like to do?`,
            name: 'roleType',
            choices: selectionOptionsRole
            }])
          let recordsVAER = await findAllEmployeeByRole(questionVAER.roleType)
          console.table(recordsVAER)
          break;
            
        case 'View All Employee by Department':
          let selectionOptionsDepartment = await findAllDepartmentType();
          let questionVAED = await inquirer.prompt([{
            type: 'list', 
            message: `What would you like to do?`,
            name: 'departmentType',
            choices: selectionOptionsDepartment
            }])
          let recordsVAED = await findAllEmployeeByDepartment(questionVAED.departmentType)
          console.table(recordsVAED)
          break;
          
        case 'Add Employee':
          let allRolesWithID = await findAllRoleType();
          let allRoles = allRolesWithID.map(row => row.title)
          let managerNameswithID = await findAllManagerAndID();
          let managerNames = managerNameswithID.map(row => row.managerName);
          // If no manager applicable, user will pick NONE, add this option to the selections
          managerNames.push('NONE')
          let questionAE = await inquirer.prompt([{
            message: `Please enter the new employee first name:`,
            name: 'employeeFirstname'
            },
            {
            message: `Please enter the new employee last name:`,
            name: 'employeeLastname'
            },
            {
              type: 'list', 
              message: `Please select the new employee's role:`,
              name: 'roleType',
              choices: allRoles
            },
            {
              type: 'list', 
              message: `Please select the new employee's manager:`,
              name: 'managerName',
              choices: managerNames
            }])

          console.log('Manager Name:' + questionAE.managerName);
          console.log('Role Type:' + questionAE.roleType);
          console.log(managerNameswithID);
          console.log(allRolesWithID);
          let managerID = 0
          managerNameswithID.forEach(record => {
            if (record.managerName == questionAE.managerName) managerID = record.id
          });
          let roleID = 0
          allRolesWithID.forEach(record => {
            if (record.title == questionAE.roleType) roleID = record.id
          });
          console.log('Manager ID:' + managerID);
          console.log('Role ID:' + roleID);
          let newEmployeeObj = {
            first_name: questionAE.employeeFirstname,
            last_name: questionAE.employeeLastname,
            role_id: roleID,
            manager_id: managerID
          }
          await addNewEmployee(newEmployeeObj)
          break;

          case 'Remove Employee':
            let allEmployeeNamesRE = []
            let allEmployeeNameswithIDRE = []
            allEmployeeInfo.forEach(element => {
              let fullName = element.FirstName +' ' + element.LastName
              allEmployeeNamesRE.push(fullName)
              allEmployeeNameswithIDRE.push({name: fullName, id: element.ID})
            });
            console.log(allEmployeeNamesRE)

            let questionRE = await inquirer.prompt([{
              type: 'list', 
              message: `Which Employee Info you'd like to Remove:`,
              name: 'employeeName',
              choices: allEmployeeNamesRE
              }])

            let employeeObj = allEmployeeNameswithIDRE.find((element)=>element.name == questionRE.employeeName)
            await deleteEmployee(employeeObj.id)

          case 'Update Employee Role':
            let allEmployeeNamesUER = []
            let allEmployeeNameswithIDUER = []
            allEmployeeInfo.forEach(element => {
              let fullName = element.FirstName +' ' + element.LastName
              allEmployeeNamesUER.push(fullName)
              allEmployeeNameswithIDUER.push({name: fullName, id: element.ID})
            });
            console.log(allEmployeeNamesUER)
            let allRolesWithIDUER = await findAllRoleType();
            let allRolesUER = allRolesWithIDUER.map(row => row.title)

            let questionUER = await inquirer.prompt([{
              type: 'list', 
              message: `Which Employee Info you'd like to Update:`,
              name: 'employeeName',
              choices: allEmployeeNamesUER
              },
              {
                type: 'list', 
                message: `Which Role you'd like to assign to this Employee:`,
                name: 'roleName',
                choices: allRolesUER
              }])

            let employeeObjUER = allEmployeeNameswithIDUER.find((element)=>element.name == questionUER.employeeName)
            console.log(allRolesWithIDUER)
            let roleObjUER = allRolesWithIDUER.find((element)=>element.title == questionUER.roleName)
            await updateEmployeeRole(roleObjUER.id, employeeObjUER.id)

          case 'Update Employee Manager':
            let allEmployeeNamesUEM = []
            let allEmployeeNameswithIDUEM = []
            allEmployeeInfo.forEach(element => {
              let fullName = element.FirstName +' ' + element.LastName
              allEmployeeNamesUEM.push(fullName)
              allEmployeeNameswithIDUEM.push({name: fullName, id: element.ID})
            });
            console.log(allEmployeeNamesUEM)

            let managerNameswithIDUEM = await findAllManagerAndID();
            let managerNamesUEM = managerNameswithIDUEM.map(row => row.managerName);

            let questionUEM1 = await inquirer.prompt([{
              type: 'list', 
              message: `Which employee info you'd like to update:`,
              name: 'employeeName',
              choices: allEmployeeNamesUEM
              }])
            // if the person exist from the manager's list, remove him; so they won't report to themselvs
            managerNamesUEM.forEach((element,index) => {
              if(element === questionUEM1.employeeName) managerNamesUEM.splice(index,1);
            });
            // add option to not set their manager
            managerNamesUEM.push('NONE')

            let questionUEM2 = await inquirer.prompt([{
                type: 'list', 
                message: `Which manager you'd like this Employee to report to:`,
                name: 'managerName',
                choices: managerNamesUEM
              }])

            let employeeObjUEM = allEmployeeNameswithIDUEM.find((element)=>element.name == questionUEM1.employeeName)
            let managerObjUEM = managerNameswithIDUEM.find((element)=>element.managerName == questionUEM2.managerName)
            let managerIDUEM = 0
            // if there is a manager assigned, update the managerID
            if (managerObjUEM) managerIDUEM = managerObjUEM.id

            console.log(managerNameswithIDUEM)
            console.log(employeeObjUEM)
            console.log(managerObjUEM)
            await updateEmployeeManager(managerIDUEM, employeeObjUEM.id)

          }
    }
  }


async function findAllEmployee(){
  const [rows] = await connection.query('SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, r.salary as Salary, d.name as Department, CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on d.id = r.department_id LEFT JOIN employee eManager on eManager.id = e.manager_id')
  return rows
}

async function findAllRoleType(){
  const [rows] = await connection.query('SELECT title, id FROM role')
  return rows
}

async function findAllManagerAndID(){
  const [rows] = await connection.query('SELECT CONCAT(first_name," ",last_name) as managerName, id FROM employee WHERE manager_id > 0')
  return rows
}

async function findAllEmployeeByRole(roleType){
  const [rows] = await connection.query(`SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, r.salary as Salary, d.name as Department, CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on d.id = r.department_id LEFT JOIN employee eManager on eManager.id = e.manager_id WHERE r.title = "${roleType}"`)
  return rows
}

async function findAllDepartmentType(){
  const [rows] = await connection.query('SELECT name FROM department')
  return rows.map(row => row.name)
}

async function findAllEmployeeByDepartment(departmentType){
  const [rows] = await connection.query(`SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, r.title as Title, r.salary as Salary, d.name as Department, CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName FROM employee e LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on d.id = r.department_id LEFT JOIN employee eManager on eManager.id = e.manager_id WHERE d.name = "${departmentType}"`)
  return rows
}


async function addNewEmployee (newEmployeeObj) {

  const [results] = await connection.query('INSERT INTO employee SET ?', newEmployeeObj)
  console.log(results.affectedRows + ' employee inserted!\n')
}

async function deleteEmployee(employeeID){
  const [results] = await connection.query(`DELETE FROM employee WHERE id = ${employeeID}`)
  console.log(results.affectedRows + ' employee Deleted!\n')

}

async function updateEmployeeRole(roleID, employeeID){

  const [results] = await connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id=${employeeID}`)
  console.log(results.affectedRows + ' employee Updated!\n')
}

async function updateEmployeeManager(managerID, employeeID){

  if (managerID == undefined) managerID = 0
  const [results] = await connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id=${employeeID}`)
  console.log(results.affectedRows + ' employee Updated!\n')
}