const { ALL } = require('dns');
const readline = require('readline');

/**
 * character_queue:
 * a shuffled queue of characters to type; to ensure that all characters in the set show each round 
 * When empty, shuffle again
 */
let character_queue = []
let current_round = 0
const g_inputTimestamps = []
const g_timeDiffs = []

const NUM_CHARS_PER_WORD = 5
const RUNNING_AVG_WINDOW_SIZE = 10
const MODULUS_FACTOR = 1000000 // 1_000_000

const ALPHABET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const ALPHABET = ALPHABET_LOWERCASE + ALPHABET_LOWERCASE.toUpperCase()
const DIGITS = '0123456789'
const SPECIAL_CHARACTERS = '!@#$%^&*()_+[{}]:;<>,.?/~`-=|\\"\'`'
const ALL_CHARACTERS = ALPHABET
    + DIGITS
    + DIGITS
    + SPECIAL_CHARACTERS
    + SPECIAL_CHARACTERS
    + SPECIAL_CHARACTERS

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

function shuffle() {
    character_queue = [...ALL_CHARACTERS]
        .sort(() => Math.random() - 0.5)
}

function update_time_diffs() {
    const currentTime = Date.now();
    if (g_inputTimestamps.length > 0) {
        const prevTime = g_inputTimestamps[g_inputTimestamps.length - 1]
        g_timeDiffs.push(currentTime - prevTime)
    }
    g_inputTimestamps.push(currentTime)
}

function print_header() {
    const MS_IN_SEC = 1000
    const SEC_IN_MIN = 60
    let avg_time_s = 0
    let current_time_s = 0
    let avg_wpm = 0
    let current_wpm = 0
    const diff_length = g_timeDiffs.length
    if (diff_length) {
        const window_start = Math.max(0, diff_length - RUNNING_AVG_WINDOW_SIZE)
        const avg_time_ms = (
            g_timeDiffs
                .slice(window_start)
                .reduce((a, b) => a + b)
        ) / (diff_length - window_start)
        avg_time_s = avg_time_ms / MS_IN_SEC
        current_time_s = g_timeDiffs[g_timeDiffs.length - 1] / MS_IN_SEC
        avg_wpm = SEC_IN_MIN / (avg_time_s * NUM_CHARS_PER_WORD)
        current_wpm = SEC_IN_MIN / (current_time_s * NUM_CHARS_PER_WORD)
    }
    print(`\n Typing Practice - round ${current_round}\n`)
    print(` ${avg_wpm.toFixed(1).padStart(4, ' ')    } : run avg wpm    ${avg_time_s.toFixed(2)    }s : run avg time:\n`)
    print(` ${current_wpm.toFixed(1).padStart(4, ' ')} : current wpm    ${current_time_s.toFixed(2)}s : current time: \n`)
}

function readKey() {
    return new Promise(resolve => {
        process.stdin.once('data', function (key) {
            // Exit on Ctrl+C
            if (key === '\u0003') {
                exit();
            }
            // Convert special keys to understandable representations or ignore them
            if (key === '\r' || key === '\n') { // Enter key
                clear_below_line(7)
                key = 'Enter';
            } else if (key === '\u001b') {
                key = 'Escape';
            } else if (key === ' ' || key === '\t') { // Space
                key = 'Space';
            } else if (key === '\x7f' || key === '\b') { // Backspace (might vary based on system)
                // Clear the line and return the cursor to the beginning of the line
                clear_below_line(7)
                key = 'Backspace';
            }
            resolve({
                key
            })
        });
    });
}

async function read_next_char(char=null) {
    // print a random character from the alphabet
    if (char === null) {
        if (character_queue.length === 0) {
            current_round++
            shuffle()
        }
        char = character_queue.pop()
        print_header()
        print(`\n ${char}\n `)
    }
    const userInput = await readKey()
    // get user character input from
    return {
        char,
        userInput,
        match: userInput.key === char,
        skip: userInput.key === 'Escape',
        time: userInput.time
    }
}

async function main() {
    clear_page()
    let input = await read_next_char()
    while (true) {
        while (!input.match && !input.skip) {
            input = await read_next_char(input.char)
        }
        clear_page()
        if (input.match) {
            update_time_diffs()
        }
        input = await read_next_char()
    }
    exit()
}

main()