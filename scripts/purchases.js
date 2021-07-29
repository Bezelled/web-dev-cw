//Assign our HTML elements to variables and constants for ease of modification
const txtNoOfAdults = document.getElementById("adult");
const txtNoOfChildren = document.getElementById("child");
const txtAnnualPass = document.getElementById("annual");
const txtFoodToken = document.getElementById("food");
const btnAddToOrder = document.getElementById("addToOrder");
const btnPlaceOrder = document.getElementById("placeOrder");
const btnFavourite = document.getElementById("favourite");
const btnOrderFavourite = document.getElementById("orderFavourite");
const btnLoyalty = document.getElementById("loyalty");
const btnDonate = document.getElementById("donate");
const txtCurrent = document.getElementById("current");
const txtCostCurrent = document.getElementById("costCurrent");
const txtOverall = document.getElementById("overall");
const txtCostOverall = document.getElementById("costOverall");
const radios = document.querySelectorAll("input[type=radio]");

//Event listeners
txtNoOfAdults.addEventListener("input", updateOrder);
txtNoOfChildren.addEventListener("input", updateOrder);
txtAnnualPass.addEventListener("input", updateOrder);
txtFoodToken.addEventListener("input", updateOrder);
radios.forEach(radio => {
    radio.addEventListener("click", updateOrder);
});
btnAddToOrder.addEventListener("click", addToOrder);
btnPlaceOrder.addEventListener("click", placeOrder);
btnFavourite.addEventListener("click", addToFavourite);
btnOrderFavourite.addEventListener("click", orderFavourite);
btnLoyalty.addEventListener("click", checkLoyalty);
btnDonate.addEventListener("click", newDonation);

//Initialise our prices of set scenarios
const adultDayPass = 1000;
const childDayPass = 500;
const adultStudentPass = 500;
const childStudentPass = 250;
const adultForeignerPass = 5000;
const childForeignerPass = 2500;
//Adult 3 hrs and child 3 hrs – no additional charge
const halfDayPrice = 250;
const fullDayPrice = 500;
const twoDaysPrice = 1000;
const annualPassPrice = 5000;
const foodTokenPrice = 500;
const ticket = {
    passChoice : "",
    noOfAdults : 0,
    noOfChildren : 0,
    duration : "",
    annualPass : 0,
    foodToken : 0,
    currentOrder : 0,
    costCurrent : 0
};
let costOverall = 0;

function getSelectedRadioButton(name){
    let selectedChoice;
    let btnSelectedRadioChoice = document.getElementsByName(name);
    for (let i=0; i<btnSelectedRadioChoice.length; i++){
        if (btnSelectedRadioChoice[i].checked){
            selectedChoice = btnSelectedRadioChoice[i].value;
        }
    }
    return selectedChoice;
}

function updateOrder(){
    ticket.costCurrent = 0;
    ticket.passChoice = getSelectedRadioButton("pass");
    ticket.noOfAdults = parseInt(txtNoOfAdults.value);
    ticket.noOfChildren = parseInt(txtNoOfChildren.value);
    ticket.duration = getSelectedRadioButton("dur");
    ticket.annualPass = parseInt(txtAnnualPass.value);
    ticket.foodToken = parseInt(txtFoodToken.value);
    retrievePrices();
}

function retrievePrices(){
    if ((ticket.noOfAdults>0) || (ticket.noOfChildren>0)){
        switch (ticket.passChoice){
            case "Day Pass":
                ticket.costCurrent += ((adultDayPass*ticket.noOfAdults) + (childDayPass*ticket.noOfChildren));
                break;
            case "Student Pass":
                ticket.costCurrent += ((adultStudentPass*ticket.noOfAdults) + (childStudentPass*ticket.noOfChildren));
                break;
            case "Foreigner Pass":
                ticket.costCurrent += ((adultForeignerPass*ticket.noOfAdults) + (childForeignerPass*ticket.noOfChildren));
                break;
        }
        switch (ticket.duration){
            case "Three Hours":
                break;
            case "Half Day":
                ticket.costCurrent += (halfDayPrice*(ticket.noOfAdults + ticket.noOfChildren));
                break;
            case "Full Day":
                ticket.costCurrent += (fullDayPrice*(ticket.noOfAdults + ticket.noOfChildren));
                break;
            case "Two Days":
                ticket.costCurrent += (twoDaysPrice*(ticket.noOfAdults + ticket.noOfChildren));
                break;
        }
        ticket.costCurrent += (ticket.annualPass*annualPassPrice) + (ticket.foodToken*foodTokenPrice);    //add the number of yearly passes and food tokens at the end
    }
    showCurrentOrder();
}

function showCurrentOrder(){
    document.getElementById("cartTitle").innerText="";
    document.getElementById("passTypeC").innerText=`Your Ticket Type : ${ticket.passChoice}`;
    document.getElementById("adultTicketsC").innerText=`No. of adults : ${ticket.noOfAdults}`;
    document.getElementById("childTicketsC").innerText=`No. of children : ${ticket.noOfChildren}`;
    document.getElementById("durationC").innerText=`Duration of your visit : ${ticket.duration}`;
    document.getElementById("annualPassC").innerText=`Annual Pass Tokens : ${ticket.annualPass}`;
    document.getElementById("foodTokensC").innerText=`Food Tokens : ${ticket.foodToken}`;
    txtCostCurrent.innerText = ticket.costCurrent;
}

function showOverallOrder(){
    let extras;
    document.getElementById("overallTicketTitle").innerHTML="<b><u>Overall Order</u></b>";
    ((ticket.annualPass + ticket.foodToken)==0) ? extras="" : extras=`Extras : Annual Pass(es) - ${ticket.annualPass}, Food Token(s) - ${ticket.foodToken}`;
    document.getElementById("overallTicket").innerHTML+=`• ${ticket.passChoice} for ${ticket.noOfAdults} adult(s) and ${ticket.noOfChildren} child(ren) of duration : ${ticket.duration}.<br>${extras}<br><br>`;
    txtCostOverall.innerText = costOverall;
}

function addToOrder(){
    if (ticket.costCurrent!=0){
        costOverall += ticket.costCurrent;
        document.getElementById("purchaseForm").reset();
        txtCostOverall.innerText = String(costOverall);
        showOverallOrder(); 
    } else{
        alert("Sorry! 😕\nYou have to choose a valid Ticket Pass, Attendees and Duration!");
    }
}

function placeOrder(){
    alert(`Thank you for your purchase!\n Brought to you by The Dehiwala Zoo with ❤️!`);
    window.location.href = window.location.href;
}

function addToFavourite(){
    localStorage.favourite = JSON.stringify(ticket);  //Store our array in JSON string format in localStorage
    alert("Success! Your Order is now your Favourite! ❤️");
}

function orderFavourite(){
    if (!localStorage.favourite) {
        alert("You do not seem to have a Favourite Order! 😕\n You can make one by clicking \"Favourite this Order!\"");
    }
    else{
        Object.assign(ticket, JSON.parse(localStorage.favourite));    //Retrieve our JSON format array stored in localStorage and parse it
        showCurrentOrder();
    }
}

function checkLoyalty(){
    updateOrder();
    let items = ticket.noOfAdults + ticket.noOfChildren + ticket.annualPass + ticket.foodToken;
    if (items>3){
        let loyalty = (items*20);
        localStorage.setItem("loyaltyPoints", loyalty);
        alert(`You can earn ${loyalty} Loyalty Points! ❤️`);
    }
    else{
        alert("Sorry! Your order is not applicable for any Loyalty Points! 😕");
    }
}

function newDonation(){
    let donationForm = document.getElementById("donationForm");
    for (let i=0; i<donationForm.elements.length; i++){
        if (donationForm.elements[i].value === '' && donationForm.elements[i].hasAttribute('required')){
            alert('Please fill out the necessary fields! 😕');
            return;
        }
    }
    donationForm.reset();
    alert("Thank you for your donation! ❤️");
}
