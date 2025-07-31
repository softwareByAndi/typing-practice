const { ALL } = require('dns');
const readline = require('readline');

/**
 * queue: list of math problems to solve
 */
let MAX_QUEUE_SIZE = 10
let QUEUE = Array(MAX_QUEUE_SIZE).fill(null)
let current_round = 0

const STD_OPERATIONS = {
    '*' : (a, b) => a * b,
    '/' : (a, b) => a / b,
    '+' : (a, b) => a + b,
    '-' : (a, b) => a - b,
    '%' : (a, b) => a % b,
    '^' : (a, b) => a ** b
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Set stdin in raw mode to read characters individually
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

function exit() {
    process.exit()
}

function print(str) {
    process.stdout.write(str)
}

function clear_page() {
    console.clear()
}

function clear_line() {
    print('\x1b[2K\r ');
}

function clear_below_line(lineNumber) {
    // Move the cursor to the beginning of the desired line
    process.stdout.write(`\x1b[${lineNumber};1H`);
    // Clear the screen from the cursor down
    process.stdout.write('\x1b[J ');
}

function generate_problem_set() {
    current_round++
    const operations = Object.keys(STD_OPERATIONS)
    const problem_set = []
    for (let i = 0; i < MAX_QUEUE_SIZE; i++) {
        const a = Math.floor(Math.random() * 10)
        const b = Math.floor(Math.random() * 10)
        const operation = operations[Math.floor(Math.random() * operations.length)]
        problem_set.push({a, b, operation})
    }
    QUEUE = problem_set
}

function print_header() {
    print(`\n Typing Practice - round ${current_round}\n`)
}

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function prompt_question(problem=null) {
    if (QUEUE.length === 0) {
        generate_problem_set()
    }
    if (problem === null) {
        problem = QUEUE.shift()
    }
    console.log(problem)
    print_header()
    const problem_string = `\n ${problem.a} ${problem.operation} ${problem.b} = `
    const answer = STD_OPERATIONS[problem.operation](problem.a, problem.b).toFixed(2)
    
    // get user input
    const userInput = await question(problem_string)
    const is_correct = parseFloat(userInput) == answer
    
    return {
        userInput,
        is_correct,
        problem,
        answer,
    }
}

async function main() {
    generate_problem_set()
    clear_page()
    let response = await prompt_question()
    while (true) {
        while (!response.is_correct && !response.skip) {
            console.log(`Incorrect! Try again.\n`)
            console.log(`answer ${response.answer}`)
            console.log(`input ${response.userInput}`)
            response = await prompt_question(response.problem)
        }
        clear_page()
        response = await prompt_question()
    }
    exit()
}

main()