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
const txtCostCurrent = document.getElementById("costCurrent");
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
const halfDayPrice = 250;
const fullDayPrice = 500;
const twoDaysPrice = 1000;
const annualPassPrice = 5000;
const foodTokenPrice = 500;
//Initialise a constant Object called ticket, which has attributes that we can access & modify later for ease of use - a better approach to creating lots of variables
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

//A function to get the selected radio button from a group of radio buttons
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

//Should be fired every time an element in the web page changes; so that all data is updated in real-time
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

//A function to calculate our prices
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

//Shows the current order by showing what the user has input (but not Added to Cart)
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

//A function to show the final order with the use of template literals 
function showOverallOrder(){
    let extras;
    document.getElementById("overallTicketTitle").innerHTML="<b><u>Overall Order</u></b>";
    //If there are any extras in the current order, add it to the String variable extras, else just say no extras were ordered
    ((ticket.annualPass + ticket.foodToken)==0) ? extras="No extras ordered." : extras=`Extras : Annual Pass(es) - ${ticket.annualPass}, Food Token(s) - ${ticket.foodToken}`;
    document.getElementById("overallTicket").innerHTML+=`• ${ticket.passChoice} for ${ticket.noOfAdults} adult(s) and ${ticket.noOfChildren} child(ren) of duration : ${ticket.duration}.<br>${extras}<br><br>`;
    //For each new order, show it on a new line in point form
    txtCostOverall.innerText = costOverall;
}

function addToOrder(){
    if (ticket.costCurrent!=0){
        costOverall += ticket.costCurrent;
        document.getElementById("purchaseForm").reset();    //Reset the input form once the user Adds an Order to the Overall Order
        txtCostOverall.innerText = String(costOverall);
        showOverallOrder(); 
    } else{
        alert("Sorry! 😕\nYou have to choose a valid Ticket Pass, Attendees and Duration!");
    }
}

function validateFields(formName, successMessage){
    let theForm = document.getElementById(formName);
    //If any field in the form that is required, is not filled, prompt the user to fill it out, without simply displaying the thank you
    for (let i=0; i<theForm.elements.length; i++){
        if (theForm.elements[i].value === '' && theForm.elements[i].hasAttribute('required')){
            console.log(theForm.elements[i].name);
            alert('Please fill out the necessary fields! 😕');
            return;
        }
    }
    theForm.reset();
    alert(successMessage);
}

function placeOrder(){
    validateFields("purchaseForm", "Thank you for your purchase!\n Brought to you by The Dehiwala Zoo with ❤️!");
}

function addToFavourite(){
    localStorage.favourite = JSON.stringify(ticket);  //Store our Object in JSON string format in localStorage
    alert("Success! Your Current Order is now your Favourite! ❤️");
}

function orderFavourite(){
    if (!localStorage.favourite) {
        alert("You do not seem to have a Favourite Order! 😕\n You can make one by clicking \"Favourite this Order!\"");
    }
    else{
        Object.assign(ticket, JSON.parse(localStorage.favourite));    //Retrieve our JSON formatted Object in localStorage, parse it and assign its attributes to the ticket Object
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
    validateFields("donationForm", "Thank you for your donation! ❤️");
}
