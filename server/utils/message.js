
let generateTime = () => {

    let date_ob = new Date();

    let hours = date_ob.getHours();
    let phase = (hours >= 12) ? "PM" : "AM";

    hours = (hours)%12;
    if(hours == 0){
        hours = 12;
    }
  
    if(hours < 10){
        hours = '0' + hours;
    }

     
    let minutes = date_ob.getMinutes();
    if(minutes < 10){
        minutes = '0' + minutes;
    }

    let timeStamp = `${hours}:${minutes} ${phase}`;

    return timeStamp;
}


let generateMessage = (from, text) => {
    
    return {
        from,
        text,
        createdAt: generateTime()
    };
};

module.exports = (generateMessage)