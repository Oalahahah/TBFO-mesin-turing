function putToTapeAndSimulate() {
    let input = document.getElementById("input_string").value;
    //evalueate if the input only contain symbol 'a' and 'b'
    const symbol = ["a", "b"];
    for(let char of input){
        if (!symbol.includes(char)) {
            window.alert("symbol yang bisa dimasukkan hanya a dan b");
            return;
            break;
        }
    }
    //add blank to input
    input += "---";
    let inputLength = input.length;

    let tape = document.getElementById("tape");
    let head = document.getElementById("head");
    
    //create an arrow as a head
    let arrow = document.createElement("div");
    arrow.setAttribute("class", "arrow-down");
    //clear the head row
    head.innerHTML = "";
    //put new arrow to turing machine
    for (let i = 0; i < inputLength; i++){
        if(i == 0){
            let cell = document.createElement("td");
            cell.appendChild(arrow);
            head.appendChild(cell);
        }else{
            let cell = document.createElement("td");
            cell.textContent = " ";
            head.appendChild(cell);
        }
    }
        

    // Clear the tape row
    tape.innerHTML = "";
    //put string into tape
    for (let i = 0; i < inputLength; i++){
        let cell = document.createElement("td");
        cell.textContent = input[i];
        tape.appendChild(cell);
    }

    //reset head state to A
    head.setAttribute("class","A");
    //display #process-and-result from none
    document.getElementById('process-and-result').style.display = "flex";
    //reset hasil operation
    document.getElementById("operation").innerHTML = "( ) --> ( )";
    //show the process div
    document.getElementById("process").style.display = "flex";
    //hide result message
    let result = document.getElementById("result");
    result.style.display = "none";
    
    // Start simulation immediately
    simulation();
}


