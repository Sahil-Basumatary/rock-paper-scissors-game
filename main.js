/*
I have to write a function that randomly returns
rock,paper or scissors. math.random is a hint
as it returns a random number greater than or equal to 
zero but less than 1.
*/

function getComputerChoice(){
  let randomnumber = Math.random();
  if (randomnumber < 0.33){
    return "rock";
  } else if (randomnumber < 0.66){
    return "paper";
  } else {
    return "scissors";
  }
}

function getHumanChoice(){
  let choice = prompt("rock, paper or scissors");
  return choice.toLowerCase();
}

function playGame(){
  let humanScore = 0; //initialise scores of both to 0
  let computerScore = 0;

  function playRound(humanChoice, computerChoice){
    if (humanChoice === "rock" && computerChoice === "paper"){
      console.log("You lose");
      computerScore += 1;
    }
    else if (humanChoice === "rock" && computerChoice === "scissors"){
      console.log("you win");
      humanScore += 1;
    } 
    else if (humanChoice === "paper" && computerChoice === "rock"){
      console.log("you win");
      humanScore += 1;
    } 
    else if (humanChoice === "paper" && computerChoice === "scissors"){
      console.log("you lose");
      computerScore += 1;
    } 
    else if (humanChoice === "scissors" && computerChoice === "rock"){
      console.log("you lose");
      computerScore += 1;
    } 
    else if (humanChoice === "scissors" && computerChoice === "paper"){
      console.log("you win");
      humanScore += 1;
    } 
    else {
      console.log("its a tie!")
    }
  }
  // using loop for 5 rounds to get choices from both and playing the round each time
  /*
  if I dont use a loop and call the playgame function
  it will cause an infinite loop stack overflow because of 
  no specific end and will crash so put the playgame in the
  global scope after defining the choice to continue for
  5 times using a loop in the playgame function after the playround
  function
  */

  for (let i = 0; i < 5; i += 1){
  const computerSelection = getComputerChoice();
  const humanSelection = getHumanChoice();

  playRound(humanSelection, computerSelection);
  }

  // display the scores after playing for 5 rounds so we know who is the boss!
  //and the game will end with score being showed
  console.log(`final score: Human:- ${humanScore}, computer :- ${computerScore}`);
}

// this starts the game yay which we were waiting for!!!!
playGame();