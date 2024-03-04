function BuyProduct() {
  var Phone;
  Phone = prompt("Enter your phone: ");
  if(Phone === "" || isNaN(Phone)) {
    alert("Please enter your phone")
  }else {
    alert("Floral flowers will contact " + Phone +"as soon as!")
  }
}
