const currencies = [
    {
    name: "Dollar",
    character: "$",
    },  
    {
    name: "Euro",
    character: "€",
    },
    {
    name: "Pound",
    character: "£",
    },
    {
    name: "Peso",
    character: "₱",
    },
    {
    name: "Rupee",
    character: "₨",
    },
    {
    name: "Franc",
    character: "₣",
    },
    {
    name: "Yen",
    character: "¥",
    },  
    {
    name: "Ruble",
    character: "₽",
    },
    {
    name: "Bitcoin",
    character: "₿",
    },
];

function togglePasswordVisibility(string) {
    const textBox = document.getElementById(string);
    if (textBox.type === "password") {
    textBox.type = "textbox";
    } else if (textBox.type === "textbox") {
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

function loadCurrenciesEdit(e) {
    //load the currency list
    const currentCurrency = document.querySelector('#currentCurrency');
    currencyList = document.querySelector('#currencyList');
    currencies.forEach((currency) => {
        if (currency.character !== currentCurrency.value) {
        currencyList.innerHTML = currencyList.innerHTML + `<option value="${currency.character}">${currency.character}</option>`
        }
    });
}

function loadCurrenciesNew(e) {
  const currencyList = document.querySelector('#currencyList');
  currencies.forEach((currency) => {
    currencyList.innerHTML = currencyList.innerHTML + `<option value="${currency.character}">${currency.character}</option>`
  });
}

function adminCodeShow(e) {
    const adminCodeDiv = document.querySelector('#adminCodeDiv');
    const adminCodeCheckboxDiv = document.querySelector('#adminCodeCheckboxDiv');
    const adminCodeHideCheckbox = document.querySelector('#adminCodeHideCheckbox');
    const adminCode = document.querySelector('#adminCode');
    adminCodeHideCheckbox.checked = false;
    adminCodeDiv.classList.remove('d-none');
    adminCodeCheckboxDiv.style.display = "none";
    adminCode.required = true;

}

function adminCodeHide(e) {
    const adminCodeDiv = document.querySelector('#adminCodeDiv');
    const adminCodeCheckboxDiv = document.querySelector('#adminCodeCheckboxDiv');
    const adminCodeCheckbox = document.querySelector('#adminCodeCheckbox');
    const adminCode = document.querySelector('#adminCode');
    adminCodeCheckbox.checked = false;
    adminCodeDiv.classList.add('d-none');
    adminCodeCheckboxDiv.style.display = "block";
    adminCode.required = false;
}
