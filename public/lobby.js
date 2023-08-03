let form = document.getElementById('join-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let roomId = e.target.room_id.value
    let userId = localStorage.getItem('userId');
    window.location = `index.html?room=${roomId}&userId=${userId}`
});