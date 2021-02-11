
const electiveList = [];

function generateList(){
    const elective = [];
    elective.push(document.getElementById("elective").value);
    elective.push(document.getElementById("teacher").value);
    elective.push(document.getElementById("capacity").value);

    electiveList.push(elective);
    console.log(electiveList[0][0]);
}