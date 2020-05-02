// Database helper class that handles all the databse controller logics
class DatabaseHelper{
    constructor(connection){
        this.connection = connection
    }
// find all the employee and join them to table
// there are 3 joins used
  async findAllEmployee(){
    // const [rows] = await 
    const [rows] = await this.connection.query(`SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, 
                                                r.title as Title, r.salary as Salary, 
                                                d.name as Department, 
                                                CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName 
                                                FROM employee e 
                                                LEFT JOIN role r on e.role_id = r.id 
                                                LEFT JOIN department d on d.id = r.department_id 
                                                LEFT JOIN employee eManager on eManager.id = e.manager_id`);
    return rows
  }
  // find all the exist role types and associated id
  async findAllRoleType(){
    const [rows] = await this.connection.query('SELECT title, id FROM role')
    return rows
  }
  // find all the exist manager names and associated id
  async findAllManagerAndID(){
    const [rows] = await this.connection.query('SELECT CONCAT(first_name," ",last_name) as managerName, id FROM employee WHERE manager_id > 0')
    return rows
  }
  // find all the employee based on their role type
  async findAllEmployeeByRole(roleType){
    const [rows] = await this.connection.query(`SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, 
                                                r.title as Title, r.salary as Salary, 
                                                d.name as Department, 
                                                CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName 
                                                FROM employee e 
                                                LEFT JOIN role r on e.role_id = r.id 
                                                LEFT JOIN department d on d.id = r.department_id 
                                                LEFT JOIN employee eManager on eManager.id = e.manager_id 
                                                WHERE r.title = "${roleType}"`)
    return rows
  }
  // find all the avaliable department types
  async findAllDepartmentType(){
    const [rows] = await this.connection.query('SELECT name FROM department')
    return rows.map(row => row.name)
  }
  // find all the employee based on their department type
  async findAllEmployeeByDepartment(departmentType){
    const [rows] = await this.connection.query(`SELECT e.id as ID, e.first_name as FirstName, e.last_name as LastName, 
                                                r.title as Title, r.salary as Salary, 
                                                d.name as Department, 
                                                CONCAT(eManager.last_name," ",eManager.first_name) AS ManagerName 
                                                FROM employee e 
                                                LEFT JOIN role r on e.role_id = r.id 
                                                LEFT JOIN department d on d.id = r.department_id 
                                                LEFT JOIN employee eManager on eManager.id = e.manager_id 
                                                WHERE d.name = "${departmentType}"`)
    return rows
  }
  // add a new employee to the database
  async addNewEmployee (newEmployeeObj) {
    const [results] = await this.connection.query('INSERT INTO employee SET ?', newEmployeeObj)
    console.log(results.affectedRows + ' employee Inserted!\n')
  }
  // delete an existing employee from the database
  async deleteEmployee(employeeID){
    const [results] = await this.connection.query(`DELETE FROM employee WHERE id = ${employeeID}`)
    console.log(results.affectedRows + ' employee Deleted!\n')
  }
  // update an existing employee's role from the database
  async updateEmployeeRole(roleID, employeeID){
    const [results] = await this.connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id=${employeeID}`)
    console.log(results.affectedRows + ' employee Updated!\n')
  }
  // update an existing employee's manager from the database
  async updateEmployeeManager(managerID, employeeID){
    if (managerID == undefined) managerID = 0
    const [results] = await this.connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id=${employeeID}`)
    console.log(results.affectedRows + ' employee Updated!\n')
  }

}

module.exports = DatabaseHelper