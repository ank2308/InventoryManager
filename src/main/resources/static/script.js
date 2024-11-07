// Get the form element by its ID
const stockForm = document.getElementById('stockForm');

if(stockForm != null) {
// Add an event listener to handle form submission
    stockForm.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Gather form data into an object
        const formData = {
            brandName: document.getElementById('brandName').value,
            brandType: document.getElementById('brandType').value,
            crateLotSize: document.getElementById('crateLotSize').value,
            crateQuantity: document.getElementById('crateQuantity').value,
            liquorQuantity: document.getElementById('liquorQuantity').value,
            mrp: document.getElementById('mrp').value,
            marginPrice: document.getElementById('marginPrice').value,
            dateOfMg: document.getElementById('dateOfMg').value,
            dateEntered: document.getElementById('dateEntered').value,
        };

        console.log('Form Data:', formData);

        // Send form data to the server using fetch API
        fetch('/web/addStock/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Stock data added successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add stock data');
            });
    });
}

// Get the form element by its ID
const addUser = document.getElementById('addUser');

if(addUser != null) {
// Add an event listener to handle form submission
    addUser.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        const name = document.getElementById('name').value;
        const licenseNo = document.getElementById('licenseNo').value;
        const licenseExpiry = document.getElementById('licenseExpiry').value;
        const addressData = {
            shopno: document.getElementById('shopNo').value,
            area: document.getElementById('area').value,
            city: document.getElementById('city').value,
            pincode: document.getElementById('pincode').value
        };

        // Gather form data into an object
        const userData = {
            name: name,
            licenseNo: licenseNo,
            licenseExpiry: licenseExpiry,
            addressData: [addressData]
        };

        console.log('User Form Data:', userData);

        // Send form data to the server using fetch API
        fetch('/web/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('User data added successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add user data');
            });
    });
}


function loadMenu() {
    fetch('/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
        });
}

// Function to handle the change of the brandType dropdown
function fetchBrands() {
    let brandType = document.getElementById("brandType").value;

    if (brandType) {
        // AJAX request to get the brands by brandType
        fetch(`/web/brands/by-type/${brandType}`)
            .then(response => response.json())
            .then(data => {
                // Clear the existing brand list
                let brandList = document.getElementById("brandList");
                brandList.innerHTML = "";

                if (data.length > 0) {
                    data.forEach(brand => {
                        let li = document.createElement("li");
                        li.textContent = brand.brandName;

                        // Create Edit button
                        let editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        editButton.onclick = () => editBrand(brand.id);

                        // Create Delete button
                        let deleteButton = document.createElement("button");
                        deleteButton.textContent = "Delete";
                        deleteButton.onclick = () => deleteBrand(brand.id);

                        // Append buttons to the list item
                        li.appendChild(editButton);
                        li.appendChild(deleteButton);

                        brandList.appendChild(li);
                    });
                } else {
                    let li = document.createElement("li");
                    li.textContent = "No brands available for this type.";
                    brandList.appendChild(li);
                }
            });
    }
}

// Function to handle brand edit
function editBrand(brandId) {
    const newBrandName = prompt("Enter the new brand name:");
    if (newBrandName) {
        // AJAX request to edit the brand name
        fetch(`/web/brands/edit/${brandId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandName: newBrandName })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Brand updated successfully.');
                    fetchBrands(); // Reload the updated brand list
                } else {
                    alert('Failed to update the brand.');
                }
            });
    }
}

// Function to handle brand deletion
function deleteBrand(brandId) {
    if (confirm("Are you sure you want to delete this brand?")) {
        // AJAX request to delete the brand
        fetch(`/web/brands/delete/${brandId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Brand deleted successfully.');
                    fetchBrands(); // Reload the updated brand list
                } else {
                    alert('Failed to delete the brand.');
                }
            });
    }
}

// Function to fetch brand names based on selected brand type
function fetchBrandNames() {
    let brandType = document.getElementById("brandType").value;
    let brandNameDropdown = document.getElementById("brandName");

    if (brandType) {
        fetch(`/web/brands/by-type/${brandType}`)
            .then(response => response.json())
            .then(data => {
                // Enable the brand name dropdown
                brandNameDropdown.disabled = false;
                brandNameDropdown.innerHTML = '<option value="" disabled selected>Select Brand Name</option>';

                // Populate the brand names
                data.forEach(brand => {
                    let option = document.createElement('option');
                    option.value = brand.brandName;
                    option.textContent = brand.brandName;
                    brandNameDropdown.appendChild(option);
                });
            });
    }
}

// Script to add multiple address fields
let addressCount = 1;

function addAddress() {
    const addressList = document.getElementById("addressList");

    const newAddress = document.createElement("div");
    newAddress.className = "address-entry";
    newAddress.innerHTML = `
            <label>Shop Number:</label>
            <input type="text" name="addresses[${addressCount}].shopNo" required>

            <label>Area:</label>
            <input type="text" name="addresses[${addressCount}].area" required>

            <label>City:</label>
            <input type="text" name="addresses[${addressCount}].city" required>

            <label>State:</label>
            <input type="text" name="addresses[${addressCount}].state" required>

            <label>Pincode:</label>
            <input type="text" name="addresses[${addressCount}].pincode" required>
        `;
    addressList.appendChild(newAddress);
    addressCount++;
}


window.onload = loadMenu;
