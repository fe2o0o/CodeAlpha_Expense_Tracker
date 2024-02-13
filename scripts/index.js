/* Global Variable */
const tracker = document.getElementById("tracker");
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const addBtn = document.getElementById("addBtn");
const upDateBtn = document.getElementById("upDateBtn");
const ctx = document.getElementById("myChart").getContext("2d");
let expenseContainer = [];
let indexUpDate;
const myDate = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


/* Chart Function */

var myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 10,
        borderRadius: 30,
        spacing: 8,
      },
    ],
  },
  options: {
    aspectRatio: 1,
    cutout: 105,
    responsive: false,
  },
});

/*-----------------------------------------------------*/

/*  Check if Found data */
if (localStorage.getItem("expenseContainer") != null) {
  expenseContainer = JSON.parse(localStorage.getItem("expenseContainer"));
  displayData(expenseContainer);
  const data = upDateChart(expenseContainer);
  myChart.data.datasets[0].data = data;
  myChart.update();
  upDatePercentge(data);
}

/* Add Data Function */

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (tracker.value == "" || amount.value == 0) {
    document.getElementById("globalError").classList.remove("d-none");
  } else {
    const newExpense = collectData();
    expenseContainer.push(newExpense);
    displayData(expenseContainer);
    const data = upDateChart(expenseContainer);
    myChart.data.datasets[0].data = data;
    myChart.update();
    upDatePercentge(data);
    localStorage.setItem("expenseContainer", JSON.stringify(expenseContainer));
  }
});


/* up Date Item Function  */

upDateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (tracker.value == "" || amount.value == 0) {
    document.getElementById("globalError").classList.remove("d-none");
  } else {
    const newExpense = collectData();
    expenseContainer[indexUpDate] = newExpense;
    displayData(expenseContainer);
    const data = upDateChart(expenseContainer);
    myChart.data.datasets[0].data = data;
    myChart.update();
    upDatePercentge(data);
    localStorage.setItem("expenseContainer", JSON.stringify(expenseContainer));
    addBtn.classList.replace("d-none", "d-block");
    upDateBtn.classList.replace("d-block", "d-none");
  }
});


/* Up Date Percentege after any Action */

function upDatePercentge(arr) {
  const totalArr = arr.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  document.getElementById("totalExpense").innerHTML = totalArr + "$";
  const savingPer = Math.round((arr[0] / totalArr) * 100);
  const expensePer = Math.round((arr[1] / totalArr) * 100);
  const investmentPer = Math.round((arr[2] / totalArr) * 100);
  isNaN(savingPer)
    ? (document.getElementById("savingPer").innerHTML = 0)
    : (document.getElementById("savingPer").innerHTML = savingPer);
  isNaN(expensePer)
    ? (document.getElementById("expensePer").innerHTML = 0)
    : (document.getElementById("expensePer").innerHTML = expensePer);
  isNaN(investmentPer)
    ? (document.getElementById("investmentPer").innerHTML = 0)
    : (document.getElementById("investmentPer").innerHTML = investmentPer);
}


/* up Date Chart After any action */

function upDateChart(expenseContainer) {
  const saving = expenseContainer
    .filter((e) => {
      return e.category == "saving";
    })
    .reduce((acc, cur) => {
      return acc + +cur.amount;
    }, 0);
  const expense = expenseContainer
    .filter((e) => {
      return e.category == "expense";
    })
    .reduce((acc, cur) => {
      return acc + +cur.amount;
    }, 0);
  const investment = expenseContainer
    .filter((e) => {
      return e.category == "investment";
    })
    .reduce((acc, cur) => {
      return acc + +cur.amount;
    }, 0);

  const data = [saving, expense, investment];
  return data;
}

/* reset Form after add or update */

function reset() {
  tracker.value = "";
  amount.value = 0;
  tracker.classList.remove("showSuccess");
  amount.classList.remove("showSuccess");
}


/* display data function in tabel */

function displayData(container) {
  let cartona = ``;
  for (let i = 0; i < container.length; i++) {
    cartona += `
            <tr>
                <td>${container[i].tracker}</td>
                <td>${container[i].category}</td>
                <td>${container[i].amount}$</td>
                <td>${container[i].date}</td>
                <td>
                  <button onclick='deleteItem(${i})' title="Delete" class="btn p-0 px-2 text-danger"><i class="fa-solid fa-trash"></i></button>
                  <button onclick='upDateItem(${i})' title="UpDate" class="btn p-0 text-warning"><i class="fa fa-refresh" aria-hidden="true"></i></button>
                </td>
            </tr>
        `;
  }
  document.getElementById("tbody").innerHTML = cartona;
}


/* function to collect data from Form in add item or update */

function collectData() {
  const newExpense = {
    tracker: tracker.value,
    category: category.value,
    amount: amount.value,
    date: `${myDate.getDate() + "-" + months[myDate.getMonth()]}`,
  };
  reset();
  return newExpense;
}

/* handle validate tracker input */

tracker.addEventListener("input", (e) => {
  document.getElementById("globalError").classList.add("d-none");
  if (e.target.value != "") {
    showSuccess(e.target);
  } else {
    showError(e.target, "input is required");
  }
});


/* handle validate aamount input */

amount.addEventListener("input", (e) => {
  document.getElementById("globalError").classList.add("d-none");
  if (e.target.value < 0) {
    e.target.value = 0;
  }
  if (e.target.value == 0) {
    showError(e.target, "value should be gratter than 0");
  } else {
    showSuccess(e.target);
  }
});

function showSuccess(input) {
  input.classList.remove("showError");
  input.classList.add("showSuccess");
  document.getElementById(input.id + "ErrorMessage").innerHTML = "";
}

function showError(input, ErrorMessage) {
  input.classList.remove("showSuccess");
  input.classList.add("showError");
  document.getElementById(input.id + "ErrorMessage").innerHTML = ErrorMessage;
}


/* Handle delete item from data */

function deleteItem(index) {
  expenseContainer.splice(index, 1);
  displayData(expenseContainer);
  const data = upDateChart(expenseContainer);
  myChart.data.datasets[0].data = data;
  myChart.update();
  upDatePercentge(data);
  localStorage.setItem("expenseContainer", JSON.stringify(expenseContainer));
}

/* handle up date item from data*/

function upDateItem(index) {
  const item = expenseContainer[index];
  category.value = item.category;
  tracker.value = item.tracker;
  amount.value = item.amount;
  addBtn.classList.replace("d-block", "d-none");
  upDateBtn.classList.replace("d-none", "d-block");
  indexUpDate = index;
}
