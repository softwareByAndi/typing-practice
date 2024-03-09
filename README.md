# typing-practice
a js script for typing practice in the terminal for programmers who want just 5 quick minutes to improve reaction speed and typing speed. 

Random characters appear 1 at a time, so this script improves reading comprehension, reaction timing, and typing speed.

## interface looks like this

``` text

 Typing Practice - round 3
 11.7 : run avg wpm    1.02s : run avg time:
  6.9 : current wpm    1.74s : current time: 

 #

```

## logic notes

- characters are sorted randomly into a queue, and popped off 1 at a time.
    - every time the character queue is emptied, it's re-populated and re-shuffled.
    - this is to ensure a random, but uniformly distributed character pull, so that probabilities for each charcter can be controlled via its number of occurrences in the set.
- the `running avg wpm` & `running avg time` have a default window of 10 characters. (i.e. the average over the last 10 characters)
- the `current wpm` & `current time` are calculated for the last character only.
- the `round` is the current iteration of the character queue.
    - the round is incremented every time the character queue is emptied and re-populated.

## type Esc to skip a character

sometimes the terminal will bug out and the character to type will dissapear. 
It wasn't important enough to fix, so just type Esc to skip the character and move on to the next one.

## aliasing

I recommend adding an alias to your bashrc or zshrc to make it easier to run the script. 
``` bash
code ~/.bashrc
```

``` bash
# ~/.bashrc or ~/.zshrc
alias typing-practice="node ~/path/to/repository/typing-practice/typing_practice.js"
```

``` bash
source ~/.bashrc
```

<br>

# TODO

1. add accuracy measures and features to target difficult characters. 
    - characters that are commonly mistyped
    - characters that take longer to type
2. save accuracy and targeting data to a persistent file, to improve, capture and update across sessions.
    - number of mistypes for each character
    - list of times taken to type each character
    1. what about 
3. add a mode to practice targeted characters 


4. maybe add some insight logging to track performance over time.
    - what about a scoreboard? Competing against past performances.
    - maybe add some some average tracking across rounds.

