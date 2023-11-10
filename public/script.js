console.log("Hello World!");
fetch('./login', {
    method: 'POST',
    // ... other fetch options
})
.then(response => response.json())
.then(data => {
    // Handle the JSON data
    if (data.redirect) {
        window.location.href = data.redirect; // Redirect the user
    } else {
        
        // Handle other response data if needed
    }
})
.catch(error => {
    console.error('Error during registration:', error);
});