const transition = {
    "A":{  //state tujuan, write, arah
        "a":["B", "$", "R"],
        "b":["C", "$", "R"],
        "-":"Reject"
    },
    "B":{ 
        "a":["Reject", "a", "R"],
        "b":["D", "a", "R"],
        "-":["Reject", "a", "R"]
    },
    "C":{ 
        "a":["B", "b", "R"],
        "b":["C", "b", "R"],
        "-":["Reject", "b", "R"]
    },
    "D":{ 
        "a":["Reject", "a", "R"],
        "b":["Reject", "b", "R"],
        "-":["E", "b", "L"]
    },
    "E":{ 
        "a":["E", "a", "L"],
        "b":["E", "b", "L"],
        "$":["F", "$", "R"]
    },
    "F":{ 
        "a":["Reject", "0", "R"],
        "b":["G", "0", "R"],
        "-":["Reject", "-", "R"]
    },
    "G":{ 
        "a":["H", "0", "R"],
        "b":["G", "0", "R"],
        "-":["Reject", "-", "R"]
    },
    "H":{ 
        "a":["Reject", "a", "R"],
        "b":["I", "1", "R"],
        "0":["Reject", "0", "R"],
        "-":["Reject", "-", "R"]
    },
    "I":{
        "a":["Reject", "a", "R"],
        "b":["Reject", "b", "R"],
        "0":["Reject", "0", "R"],
        "1":["Reject", "1", "R"],
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
        
        //transition result with guard
        let trans = transition[currentState] && transition[currentState][currentAlphabet];
        let nextState, writeToCell, headMovement;
        
        if(!trans){
            // No transition defined => Reject
            nextState = "Reject";
            writeToCell = currentAlphabet;
            headMovement = "R";
        } else if(typeof trans === 'string'){
            // Direct string (like "Reject")
            nextState = trans;
            writeToCell = currentAlphabet;
            headMovement = "R";
        } else {
            nextState = trans[0];
            writeToCell = trans[1];
            headMovement = trans[2];
        }
        
        //ubah state
        head.setAttribute("class", nextState);
        //write into tape
        tapeContent[headCurrentPosition].innerHTML = writeToCell;
        tapeContent[headCurrentPosition].style.color = '#B6FFFA';
        
        //head movement with tape expansion
        if(headMovement == "R"){
            //head move to the right
            // Check if we need to expand tape to the right
            if(headCurrentPosition + 1 >= headChild.length){
                let newTapeCell = document.createElement("td");
                newTapeCell.textContent = "-";
                tape.appendChild(newTapeCell);
                
                let newHeadCell = document.createElement("td");
                newHeadCell.textContent = " ";
                head.appendChild(newHeadCell);
                
                // Update references
                headChild = head.getElementsByTagName("td");
                tapeContent = tape.getElementsByTagName("td");
            }
            headChild[headCurrentPosition + 1].appendChild(arrow);
            headChild[headCurrentPosition].innerHTML = " ";
        } else {
            //head move to the left
            // Check if we need to expand tape to the left
            if(headCurrentPosition === 0){
                let newTapeCell = document.createElement("td");
                newTapeCell.textContent = "-";
                tape.insertBefore(newTapeCell, tapeContent[0]);
                
                let newHeadCell = document.createElement("td");
                newHeadCell.textContent = " ";
                head.insertBefore(newHeadCell, headChild[0]);
                
                // Update references
                headChild = head.getElementsByTagName("td");
                tapeContent = tape.getElementsByTagName("td");
                
                // Arrow goes to position 0 (new leftmost position)
                headChild[0].appendChild(arrow);
            } else {
                headChild[headCurrentPosition - 1].appendChild(arrow);
                headChild[headCurrentPosition].innerHTML = " ";
            }
        }
        
        // increment step counter and update progress
        stepCount++;
        stepCountEl.innerText = stepCount;
        let prog = Math.min(95, 4 + stepCount * 8);
        progressBar.style.width = prog + '%';
        
        if((nextState == "Accept") || (nextState == "Reject")){
            //show result message
            let result = document.getElementById("result");
            let elapsed = (Date.now() - startTime) / 1000;
            totalTimeEl.innerText = elapsed.toFixed(3) + 's';
            progressBar.style.width = '100%';
            bufferingEl.style.display = 'none';
            result.innerHTML = "String " + nextState + "ed (waktu: " + elapsed.toFixed(3) + "s, langkah: " + stepCount + ")";
            result.style.display = "flex";
        }
        
        //print operasi apa yang telah dilakukan
        let operation = document.getElementById("operation");
        operation.innerHTML = "("+ currentState + ", " + currentAlphabet + ") "+
                                "-->" + "(" + nextState + "," + writeToCell +
                                ", " + headMovement + ")";
        
        //function to stop the animation
        if((nextState == "Accept") || (nextState == "Reject")){
            clearInterval(animating);
        }
    }
}