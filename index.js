// Index.js handles all the front-end view handling

//Bring in all the required modules

const mysql = require('mysql2/promise')
const inquirer = require("inquirer");
require('console.table');

//Bring in local module
const DatbaseHelper = require('./DatabaseHelper')


// decalre two global varibles which will be used more than one times 
let connectionObj
let allEmployeeInfo

// call the main function which contains all the business logic
main()
async function main () {
  try {
    connectionObj = await connect()
    const datbaseHelper = new DatbaseHelper(connectionObj)
    await initializeDBMenu(datbaseHelper)
  } catch (err) {
    console.error(err)
  }
  finally {
    connectionObj.end()
  }
}
// connect to the local database
async function connect () {
    let connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gjq.19901011',
    database: 'companydb'
  })
  return connection
}

// Initialize the menu for all the operations
async function initializeDBMenu(datbaseHelper) {

    // welcome user
    console.log('')
    console.log('-------------------------------------------------------------')
    console.log('Welcome to Employee Tracker Databse Manageement System.')
    console.log('-------------------------------------------------------------')
    console.log('')
    // unless specifed, keep the menu looping
    let keepLoop = true
    // depending on the table, ask more questions
    while(keepLoop)
    {
    allEmployeeInfo = await datbaseHelper.findAllEmployee()
    // Ask question to the user, which DB operation one'd like to view
    let questionObj = await inquirer.prompt([{
      type: 'list', 
      message: `What would you like to do?`,
      name: 'tableName',
      choices: ['View All Employee','View All Employee by Role','View All Employee by Department','Add Employee','Remove Employee','Update Employee Role', 'Update Employee Manager', 'EXIT']
      }])
    // use switch statement to handle different responese based on the selection
    switch(questionObj.tableName){
        case 'View All Employee': 
          console.log('')
          // print out all the employee information
          console.table(allEmployeeInfo)
          break;

        case 'View All Employee by Role':
          // find all the potential role types 
          let selectionOptionsRolewithID = await datbaseHelper.findAllRoleType();
          let selectionOptionsRole = selectionOptionsRolewithID.map(row => row.title)
          let questionVAER = await inquirer.prompt([{
            type: 'list', 
            message: `Please select a role type you want to view:`,
            name: 'roleType',
            choices: selectionOptionsRole
            }])
          // find all the employee based on the role types
          let recordsVAER = await datbaseHelper.findAllEmployeeByRole(questionVAER.roleType)
          console.log('')
          console.table(recordsVAER)
          break;
            
        case 'View All Employee by Department':
          // find all the potential department types
          let selectionOptionsDepartment = await datbaseHelper.findAllDepartmentType();
          let questionVAED = await inquirer.prompt([{
            type: 'list', 
            message: `Please select a department type you like to view:`,
            name: 'departmentType',
            choices: selectionOptionsDepartment
            }])
          // find all the employee based on the department types
          let recordsVAED = await datbaseHelper.findAllEmployeeByDepartment(questionVAED.departmentType)
          console.log('')
          console.table(recordsVAED)
          break;
          
        case 'Add Employee':
          // find all the potential role types
          let allRolesWithID = await datbaseHelper.findAllRoleType();
          let allRoles = allRolesWithID.map(row => row.title)
          // find all the potential manager names
          let managerNameswithID = await datbaseHelper.findAllManagerAndID();
          let managerNames = managerNameswithID.map(row => row.managerName);
          // If no manager applicable, user will pick NONE, add this option to the selections
          managerNames.push('NONE')
          // collect new employee information from the user
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
          // default manager ID to 0
          let managerID = 0
          managerNameswithID.forEach(record => {
            // assign manager ID based on the manager name user picked
            if (record.managerName == questionAE.managerName) managerID = record.id
          });
          // default role ID to 0
          let roleID = 0
          allRolesWithID.forEach(record => {
            // assign role ID based on the role title user picked
            if (record.title == questionAE.roleType) roleID = record.id
          });
          console.log('Manager ID:' + managerID);
          console.log('Role ID:' + roleID);
          // create a new employee object
          let newEmployeeObj = {
            first_name: questionAE.employeeFirstname,
            last_name: questionAE.employeeLastname,
            role_id: roleID,
            manager_id: managerID
          }
          // add new employee to the database table
          await datbaseHelper.addNewEmployee(newEmployeeObj)
          break;

        case 'Remove Employee':
          // create two array to hold values
          let allEmployeeNamesRE = []
          let allEmployeeNameswithIDRE = []
          // push values to the two all-employee-name array and the all-employee-name-wth-ID array
          allEmployeeInfo.forEach(element => {
            let fullName = element.FirstName +' ' + element.LastName
            allEmployeeNamesRE.push(fullName)
            allEmployeeNameswithIDRE.push({name: fullName, id: element.ID})
          });
          // let user select a user they want to remove
          let questionRE = await inquirer.prompt([{
            type: 'list', 
            message: `Which Employee Info you'd like to Remove:`,
            name: 'employeeName',
            choices: allEmployeeNamesRE
            }])
          // find the employee's id based on the employee name user picked
          let employeeObj = allEmployeeNameswithIDRE.find((element)=>element.name == questionRE.employeeName)
          await datbaseHelper.deleteEmployee(employeeObj.id)
          break;

        case 'Update Employee Role':
          // create two array to hold values
          let allEmployeeNamesUER = []
          let allEmployeeNameswithIDUER = []
          // push values to the two all-employee-name array and the all-employee-name-wth-ID array
          allEmployeeInfo.forEach(element => {
            let fullName = element.FirstName +' ' + element.LastName
            allEmployeeNamesUER.push(fullName)
            allEmployeeNameswithIDUER.push({name: fullName, id: element.ID})
          });
          // find all the role names and id
          let allRolesWithIDUER = await datbaseHelper.findAllRoleType();
          let allRolesUER = allRolesWithIDUER.map(row => row.title)
          // let user pick a role name
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

          // find the employee id based on the employee name
          let employeeObjUER = allEmployeeNameswithIDUER.find((element)=>element.name == questionUER.employeeName)
          // find the role id based on the role name
          let roleObjUER = allRolesWithIDUER.find((element)=>element.title == questionUER.roleName)
          // update the employee's role
          await datbaseHelper.updateEmployeeRole(roleObjUER.id, employeeObjUER.id)
          break;

        case 'Update Employee Manager':
          // create two array to hold values
          let allEmployeeNamesUEM = []
          let allEmployeeNameswithIDUEM = []
          // push values to the two all-employee-name array and the all-employee-name-wth-ID array
          allEmployeeInfo.forEach(element => {
            let fullName = element.FirstName +' ' + element.LastName
            allEmployeeNamesUEM.push(fullName)
            allEmployeeNameswithIDUEM.push({name: fullName, id: element.ID})
          });

          // find all the manager names and id
          let managerNameswithIDUEM = await datbaseHelper.findAllManagerAndID();
          let managerNamesUEM = managerNameswithIDUEM.map(row => row.managerName);
          // let user pick a employee name that needs to be updated
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
          // update employee's manager
          await datbaseHelper.updateEmployeeManager(managerIDUEM, employeeObjUEM.id)
          break;
        // exit out the menu
        default:
          // farewell user
          console.log('')
          console.log('-------------------------------------------------------------')
          console.log('Thanks for using Employee Tracker Databse Manageement System.')
          console.log('Good Bye!')
          console.log('-------------------------------------------------------------')
          keepLoop = false
          break;
        }
    }
}
