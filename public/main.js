function togglePasswordVisibility() {
    const textBox = document.getElementById("password");
    if (textBox.type === "password") {
    textBox.type = "textbox";
    } else {
    textBox.type = "password";
    }
}

function checkZipCodeLength(e) {
    const tb_ZipCode = document.querySelector('#zipCode');
    console.dir(tb_ZipCode);
    if (tb_ZipCode.value.length !== 5 && tb_ZipCode.value.length !== 9)
    {
        alert('Zipcodes must be either 5 or 9 numbers long.');
        tb_ZipCode.value = "";
    }
}