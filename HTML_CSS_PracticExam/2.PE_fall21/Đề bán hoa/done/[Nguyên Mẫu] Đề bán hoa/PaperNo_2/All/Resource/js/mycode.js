function buyflowers() {
    var Phone = prompt("Enter your phone")
    if(check(Phone) == true) {
        alert("This is not phone numbers")
    }else {
        alert("Floral will contact you via phone number: \n" + Phone)

    }
}
function check(input) {
    if(isNaN(input)) {
        return true
    }else {
        return false
    }
}