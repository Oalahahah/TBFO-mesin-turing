const transition = {
    "A":{  //state tujuan, write, arah
        "a":["B", "$", "R"],
        "b":["C", "$", "R"],
        "-":"halt"
    },
    "B":{ 
        "a":["B", "a", "R"],
        "b":["C", "a", "R"],
        "-":["D", "a", "L"]
    },
    "C":{ 
        "a":["B", "b", "R"],
        "b":["C", "b", "R"],
        "-":["D", "b", "L"]
    },
    "D":{ 
        "a":["D", "a", "L"],
        "b":["D", "b", "L"],
        "$":["E", "$", "R"]
    },
    "E":{ 
        "a":["F", "0", "R"],
        "b":["Reject", "b", "R"],
        "-":["Reject", "-", "R"]
    },
    "F":{ 
        "a":["G", "0", "R"],
        "b":["F", "1", "R"],
        "-":["Reject", "-", "R"]
    },
    "G":{ 
        "a":["Reject", "a", "R"],
        "b":["Reject", "b", "R"],
        "-":["Accept", "-", "R"]
    },
    "Accept":[],
    "Reject":[]
};

function simulation(){
    const animating = setInterval(calculate, 1500);
    function calculate(){
        //get head
        let head = document.getElementById("head");
        let headChild = head.getElementsByTagName("td");
        
        //get tape
        let tape = document.getElementById("tape");
        let tapeContent = tape.getElementsByTagName("td");
        //create new arrow
        let arrow = document.createElement("div");
        arrow.setAttribute("class", "arrow-down");

        
        //get head current position
        let headCurrentPosition = 0;
        for(let i = 0; i < headChild.length; i++){
            if(headChild[i].innerHTML !== " "){
                headCurrentPosition = i;
                break;
            }
        }

        //get current state
        let currentState = head.getAttribute("class");
        //get current cell alphabet
        let currentAlphabet = tapeContent[headCurrentPosition].innerHTML;

        //transition result
        let nextState = transition[currentState][currentAlphabet][0];
        let writeToCell = transition[currentState][currentAlphabet][1];
        let headMovement = transition[currentState][currentAlphabet][2];


        //ubah state
        head.setAttribute("class",nextState);
        //write into tape
        tapeContent[headCurrentPosition].innerHTML = writeToCell;
        tapeContent[headCurrentPosition].style.color = '#B6FFFA';

        //head movement
        if(headMovement == "R"){
            //head move to the right
            headChild[headCurrentPosition + 1].appendChild(arrow);
            headChild[headCurrentPosition].innerHTML = " ";
        }else{
            //head move to the left
            headChild[headCurrentPosition - 1].appendChild(arrow);
            headChild[headCurrentPosition].innerHTML = " ";
        }

        if((nextState == "Accept") || (nextState == "Reject") ){
            //assign value to finalState
            //get rid of the button
            //let processButton = document.getElementById("process-button");
            //processButton.style.display = "none";
            //show result message
            let result = document.getElementById("result");
            result.innerHTML = "The String is " + nextState + "ed";
            result.style.display = "flex";
        }

        //print operasi apa yang telah dilakukan
        let operation = document.getElementById("operation");
        operation.innerHTML = "("+ currentState + ", " + currentAlphabet + ") "+
                                "-->" + "(" + nextState + "," + writeToCell +
                                ", " +headMovement + ")";
        
        //hide process button
        let processButton = document.getElementById("process-button");
        processButton.style.display = "none";

        //function so stop the animation
        if((nextState == "Accept") || (nextState == "Reject") ){
            clearInterval(animating);
        }
    }
}