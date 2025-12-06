const transition = {
    // Start state: accept any number of leading 'b's (stay in A),
    // then an 'a' moves to B, then a single 'b' moves to C.
    // After C, the next symbol must be blank '-' to accept.
    "A":{
        "b":["A", "b", "R"],
        "a":["B", "a", "R"],
        "-":["Reject", "-", "R"]
    },
    "B":{
        "b":["C", "b", "R"],
        "a":["Reject", "a", "R"],
        "-":["Reject", "-", "R"]
    },
    "C":{
        // after the final required 'b', we must see a blank to accept
        "b":["Reject", "b", "R"],
        "a":["Reject", "a", "R"],
        "-":["Accept", "-", "R"]
    },
    "Accept":[],
    "Reject":[]
};

function simulation(){
    // show buffering UI and start timer
    const bufferingEl = document.getElementById('buffering');
    const timeDisplay = document.getElementById('time-display');
    const progressBar = document.getElementById('progress-bar');
    const totalTimeEl = document.getElementById('total-time');
    const stepCountEl = document.getElementById('step-count');
    bufferingEl.style.display = 'flex';
    timeDisplay.style.display = 'block';
    progressBar.style.width = '4%';
    let startTime = Date.now();
    let stepCount = 0;

    const animating = setInterval(calculate, 1200);
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

        //transition result (guard against undefined transitions)
        let trans = transition[currentState] && transition[currentState][currentAlphabet];
        if(!trans){
            // no valid transition => reject
            var nextState = "Reject";
            var writeToCell = currentAlphabet;
            var headMovement = "R";
        }else{
            var nextState = trans[0];
            var writeToCell = trans[1];
            var headMovement = trans[2];
        }


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

        // increment step counter and update progress
        stepCount++;
        stepCountEl.innerText = stepCount;
        // progress growth heuristic (grow with steps but cap before completion)
        let prog = Math.min(95, 4 + stepCount * 10);
        progressBar.style.width = prog + '%';

        if((nextState == "Accept") || (nextState == "Reject") ){
            //assign value to finalState
            //show result message
            let result = document.getElementById("result");
            let elapsed = (Date.now() - startTime) / 1000;
            totalTimeEl.innerText = elapsed.toFixed(3) + 's';
            progressBar.style.width = '100%';
            bufferingEl.style.display = 'none';
            result.innerHTML = "The String is " + nextState + "ed" +
                                " (waktu: " + elapsed.toFixed(3) + "s, langkah: " + stepCount + ")";
            result.style.display = "flex";
        }

        //print operasi apa yang telah dilakukan
        let operation = document.getElementById("operation");
        operation.innerHTML = "("+ currentState + ", " + currentAlphabet + ") "+
                                "-->" + "(" + nextState + "," + writeToCell +
                                ", " +headMovement + ")";

        //function so stop the animation
        if((nextState == "Accept") || (nextState == "Reject") ){
            clearInterval(animating);
        }
    }
}