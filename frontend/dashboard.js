

document.addEventListener('DOMContentLoaded',  async function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    fetchTotalExpensesPercategory();
    const baseUrl = 'https://smart-expense-api-v1.onrender.com';
    //fetch the data of expenses
    async function fetchTotalExpensesPercategory(){
        try{
            const response = await fetch(`${baseUrl}/api/expenses/getTotalExpensesByCategory`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if(response.ok){
                const categories = data.totalExpenses.map(exp=>exp.category);
                const totalAmounts = data.totalExpenses.map(exp=>exp.totalAmount);
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: categories,
                        datasets: [{
                            label: 'Expense Breakdown',
                            data: totalAmounts,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        var label = tooltipItem.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        label += Math.round(tooltipItem.raw) + ' USD'; // Format tooltip text
                                        return label;
                                    }
                                }
                            }
                        }
                    }
                });
            } else{
                console.log('Failed to fetch Total Amounts')
            }
        }catch(e){}
    }

 //Add expense Modal
var openModelBtn = document.getElementById('openModalBtn');
var modal = document.getElementById('expenseModal');
var closeModalBtn = document.getElementById('closeModalBtn');
 
openModelBtn.addEventListener('click', function(){
    modal.style.display = 'flex';
});
closeModalBtn.addEventListener('click', function(){
    modal.style.display = 'none';
});
window.addEventListener('click', function(event){
    if(event.target === modal){
        modal.style.display = 'none';
    }
});


    const totalExpenses = document.getElementById('totalExpenses');
    const allExpenses = document.getElementById('all_Expenses');
    const userName = document.getElementById('userName');

 /**Get user profile information */
    async function userProfileInfo(){
        try{
            const response = await fetch(`${baseUrl}/api/userProfile`, {
                method: 'GET',
                headers:   {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            if(response.ok){
                userName.textContent = `${data.result[0].username}`;
                console.log(data.result);
            } else {
                alert(data.message);
            }
        }catch(e){

        }
    }
    /**Open BugetModal */
    const budgetLink = document.getElementById('budget-link');
    const budgetModal = document.getElementById('budgetModal');
    const closeBudgetModalBtn = document.getElementById('closeBudgetModalBtn');
     
    openModelBtn.addEventListener('click', function(){
        budgetModal.style.display = 'flex';
    });
    budgetLink.addEventListener('click', function(event) {
        event.preventDefault();
        budgetModal.style.display = 'flex';
    });
    
    // Close budget modal
    closeBudgetModalBtn.addEventListener('click', function() {
        budgetModal.style.display = 'none';
    });
    
    // Close budget modal by clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === budgetModal) {
            budgetModal.style.display = 'none';
        }
    });


    /**Get all curent User expenses and and them to the ui */
async function getAllUserExpenses() {
    try {
        const response = await fetch(`${baseUrl}/api/expenses/getUserExpenses`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data.expenses);
            const expensesTableBody = document.getElementById('expensesTableBody');
            expensesTableBody.innerHTML = '';
            data.expenses.forEach((expense, index) => {
                // Create a new table row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${expense.expenseName}</td>
                    <td>${expense.category}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.date}</td>
                    <td><button class="edit-btn" data-id="${expense.id}">Edit</button></td>
                    <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
                `;
                // Append the row to the table body
                expensesTableBody.appendChild(row);
            });

           // Add event listener to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const expenseid = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this expense?')) {
                        deleteUserExpenses(expenseid);
                    }
                });
            });

            // Add event listener to edit buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const expenseid = this.getAttribute('data-id');
                    const expense = data.expenses.find(exp => exp.id === expenseid);
                    console.log('Expense:', expense);
                    if (expense) {
                        openEditModal(expense);
                    } else {
                        console.log('Expense Not found');
                    }
                });
            });
            fetchTotalExpensesPercategory();
        } else {
            console.log('Failed to fetch Expenses');
        }
    } catch (err) {
        console.error('Error fetching expenses:', err);
    }
}

// Delete user expenses
async function deleteUserExpenses(expenseid) {
    try {
        const response = await fetch(`${baseUrl}/api/expenses/deleteExpense/${expenseid}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data.message);
            alert(data.message);
            getAllUserExpenses();
            updateTotalExpenses();
            fetchTotalExpensesPercategory();
        } else {
            console.log(data.error);
            alert(data.error);
        }
    } catch (e) {
        console.error('Error deleting expense:', e);
    }
}

// Get the modals
const editModal = document.getElementById('editExpenseModal');
const closeEditModal = document.getElementById('closeEditModal');
const editExpenseForm = document.getElementById('editExpenseForm');
// Variable to store the current expense being edited
let currentExpenseId = null;

// Open edit modal
function openEditModal(expense) {
    currentExpenseId = expense.id;
    document.getElementById('editExpenseName').value = expense.expenseName;
    document.getElementById('editExpenseCategory').value = expense.category;
    document.getElementById('editExpenseAmount').value = expense.amount;
    document.getElementById('editExpenseDate').value = expense.date;
    editModal.style.display = 'block';
}

// Close edit modal
closeEditModal.addEventListener('click', function () {
    editModal.style.display = 'none';
});

// Close the modal by user click outside the X button
window.addEventListener('click', function (event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Form submission
editExpenseForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const expenseName = document.getElementById('editExpenseName').value;
    const category = document.getElementById('editExpenseCategory').value;
    const amount = document.getElementById('editExpenseAmount').value;
    const date = document.getElementById('editExpenseDate').value;

    try {
        const response = await fetch(`${baseUrl}/api/expenses/updateExpenses/${currentExpenseId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ expenseName, category, amount, date }),
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            editModal.style.display = 'none';
            getAllUserExpenses();
            updateTotalExpenses();
        } else {
            console.log(data.error);
        }
    } catch (e) {
        console.error('Error updating expense:', e);
    }
});

   

    
    updateTotalExpenses();
     await getAllUserExpenses();
     await userProfileInfo();
     await fetchTotalExpensesPercategory();


     /** Save expense to Database */

     const form = document.getElementById('expenseForm');
     form.addEventListener('submit', async(e)=>{
         e.preventDefault();
 
         const expenseName = document.getElementById('expenseName').value;
         const category = document.getElementById('expenseCategory').value;
         const amount = document.getElementById('expenseAmount').value;
         const date= document.getElementById('expenseDate').value;
         const authMessage =document.getElementById('auth-msg');
 
         try{
             const response =  await  fetch(`${baseUrl}/api/expenses/addexpense`, {
                 method : 'POST',
                 headers: {
                     "Content-Type" : "application/json",
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                 },
                 body: JSON.stringify({expenseName, category, amount, date}),
             });
             const data = await response.json();
             if(response.ok){
                 authMessage.textContent = data.message || 'Expense added successfully';
                 updateTotalExpenses();
                 fetchBudget();
                 getAllUserExpenses();
                 fetchTotalExpensesPercategory();
             } else {
                 authMessage.textContent = data.message || 'An error occurred';  
             }
         }catch(e){
             authMessage.textContent = e.message;
         }
     });
      /**Budget submission */
 const budgetForm = document.getElementById('budgetForm');
 budgetForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const amount = document.getElementById('budgetAmount').value;
  const authMessage = document.getElementById('budget-auth-msg');

  try {
      const response = await fetch(`${baseUrl}/api/budget/setBudget`, {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (response.ok) {
          authMessage.textContent = data.message || 'Budget set successfully';
          updateTotalExpenses(); // Refresh total expenses and update the UI
          fetchTotalExpensesPercategory();
          fetchBudget(); // Refresh the chart
      } else {
          authMessage.textContent = data.message || 'An error occurred';
      }
  } catch (e) {
      authMessage.textContent = e.message;
  }
});

   //Display Budget
    async function fetchBudget() {
        try {
            const response = await fetch(`${baseUrl}/api/budget/getBudget`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                const budgetDisplay = document.getElementById('TotalBudget');
                budgetDisplay.textContent = `Total Budget : $ ${data.budget || '0'}`;
                const budgetAmount = data.budget || '0';
                updateTotalExpenses(budgetAmount);
            } else {
                console.log(data.error);
            }
        } catch (e) {
            console.error('Error fetching budget:', e);
        }
    }

      /**Get total User Expenses and update in the Ui */
      async function updateTotalExpenses(budgetAmount){
        try{
            const response = await  fetch(`${baseUrl}/api/expenses/getTotalExpenses`, {
                method: "GET",
                headers:   {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            
            if(response.ok){
                const totalExpense = data.result[0].totalAmount;
                const remainingBudget = budgetAmount-totalExpense;
                totalExpenses.textContent = `$ ${data.result[0].totalAmount}`; 
                fetchTotalExpensesPercategory();
                const budgetDisplay = document.getElementById('remainingBudget');
                budgetDisplay.textContent = `$ ${remainingBudget >= 0 ? remainingBudget : 0}`;

               const totalExpensesDisplay = document.getElementById('totalExpensesDisplay');
               totalExpensesDisplay.textContent = `$ ${totalExpenses}`;

            // Optionally, you could also display a warning if the budget is exceeded
            if (remainingBudget < 0) {
                alert('Warning: You have exceeded your budget!');
            }
            } else {
                console.log(data.error);
                alert(data.error);
            }
        }catch(e){
        
        }
    }
    updateTotalExpenses();
    fetchBudget();
});

/**Get Total Expenses and display in Ui */
 document.addEventListener('DOMContentLoaded', async function(){
    const LogoutButton = document.getElementById('logout-btn');
    LogoutButton.addEventListener('click', async function(){
        try{
            const response = await fetch(`${baseUrl}/api/logout`, {
                method: 'POST', 
                headers: {
                    "Content-Type" : "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            if(response.ok){
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                alert(data.message || 'Logout Successful');
            } else{
                alert(data.message || 'logout failed');
            }
        }catch(e){
            console.log('logout error', e);
        }
    });
 });
