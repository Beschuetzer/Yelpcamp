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
