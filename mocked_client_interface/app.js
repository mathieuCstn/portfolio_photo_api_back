/** @type {HTMLFormElement} */
const sendImageForm = document.forms['send-image-form']

sendImageForm.enctype = 'multipart/form-data'
sendImageForm.method = 'post'

sendImageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    fetch('/api/products/addtest', {
        method: 'post',
        body: formData
    })
        .then(data => data.json())
        .then(console.log)
        .catch(console.error)
})