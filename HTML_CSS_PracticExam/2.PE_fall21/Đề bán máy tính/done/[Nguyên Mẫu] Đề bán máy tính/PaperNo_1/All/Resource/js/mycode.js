function ByProduct(){
    var phone = prompt("Enter your phone number:")
    if(phone === "" || isNaN(phone)) {
        alert("Please enter your phone number")
    }else {
        alert("MinhPhuong will contact "+phone +" as soon as!")
    }
}