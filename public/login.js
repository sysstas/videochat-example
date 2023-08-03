document.getElementById('form').addEventListener('submit', function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();

    // Call the generateId function from script.js
    let id = String(Math.floor(Math.random() * 10000));

    // Store the generated id in the localStorage
    localStorage.setItem('userId', id);

    // Redirect the user to the chat page (replace 'chat.html' with the path to your chat page)
    window.location.href = 'index.html';
});
