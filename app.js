const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const render = require("./lib/htmlRenderer");
const employees = [];

// asks questions and creates new employee
function askQuestions(role) {
    // default questions asked for each role
    let questions = [
        {
            type: 'input',
            message: `What is your ${role}'s name?`,
            name: 'name'
        },
        {
            type: 'input',
            message: `What is your ${role}'s id?`,
            name: 'id'
        },
        {
            type: 'input',
            message: `What is your ${role}'s email?`,
            name: 'email'
        },
    ];
    // if role = engineer, add engineer specific question
    if (role === "engineer") {
        questions.push({
            type: 'input',
            message: `What is your engineer's GitHub username?`,
            name: 'github'
        })
    }
    // if role = intern, add intern specific question
    else if (role === "intern") {
        questions.push({
            type: 'input',
            message: `What is your intern's school?`,
            name: 'school'
        })
    }
    // if role = manager, add manager specific question
    else {
        questions.push({
            type: 'input',
            message: `What is your manager's office number?`,
            name: 'office'
        })
    }
    // ask questions and create new employee
    inquirer.prompt(questions).then(function (data) {
        switch (role) {
            case "engineer":
                employees.push(new Engineer(data.name, data.id, data.email, data.github));
                break;
            case "intern":
                employees.push(new Intern(data.name, data.id, data.email, data.school));
                break;
            default:
                employees.push(new Manager(data.name, data.id, data.email, data.office));
        }
        // call newMemeber function to see if user wants to add another member
        newMember();
    });
}
// prompts user to see if they want to add a new member to the team
function newMember() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which type of team member would you like to add?',
                name: 'newMember',
                choices: ['Engineer', 'Intern', 'None']

            }
        ])
        .then(function (data) {
            // call askQuestions() if user wants to create new member otherwise call writeFile()
            switch (data.newMember) {
                case 'Engineer':
                    askQuestions("engineer")
                    break;
                case 'Intern':
                    askQuestions("intern");
                    break;
                default:
                    writeFile();
            }
        });
}
// creates team.html file based on the generated employees
function writeFile() {
    fs.writeFile("team.html", render(employees), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Successfully created file.");
    });
}
// start process
askQuestions("manager");