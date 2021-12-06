function generateUniqueId() {
    //"123456789"
    let id = "";

    for(let i =0; i < 6; i++) {
        const randNumber = (Math.floor(Math.random()*9))+1;

        id += randNumber;
    }
    return id;
    
}

module.exports = {generateUniqueId}