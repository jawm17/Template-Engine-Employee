const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const render = require("./lib/htmlRenderer");
const employees = [];

function askQuestions(role) {
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

    if (role === "engineer") {
        questions.push({
            type: 'input',
            message: `What is your engineer's GitHub username?`,
            name: 'github'
        })
    }
    else if (role === "intern") {
        questions.push({
            type: 'input',
            message: `What is your intern's school?`,
            name: 'school'
        })
    }
    else {
        questions.push({
            type: 'input',
            message: `What is your manager's office number?`,
            name: 'office'
        })
    }
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
        newMember();
    });
}

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

function writeFile() {
    fs.writeFile("team.html", render(employees), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Successfully created file.");
    });
}

askQuestions("manager");