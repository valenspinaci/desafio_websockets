console.log("JS home view");

const socketClient = io();

//Productos
const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    };
    socketClient.emit("newProduct", product);
    productForm.reset()
})

const productsContainer = document.getElementById("productsContainer");

socketClient.on("products", async (data) => {
    console.log(data);
    const templateTable = await fetch("./templates/table.handlebars")
    const templateFormat = await templateTable.text();
    const template = Handlebars.compile(templateFormat);
    const html = template({
        products: data
    });
    productsContainer.innerHTML = html;
})


//Chat
const chatContainer = document.getElementById("chatContainer");

socketClient.on("messagesChat", (data) => {
    console.log(data)
    let messages = "";
    data.forEach(element => {
        messages += `<p><span style="font-weight:bold; color:blue">${element.author}</span> [<span style="color:brown">${element.date}</span>] : <span style="color:green; font-style:italic">${element.text}</span></p>`
    });
    chatContainer.innerHTML = messages;
})

//Capturar el nombre de usuario
let user = "";

Swal.fire({
    title: "Bienvenido",
    text: "Ingresa tu nombre de usuario",
    input: "text",
    allowOutsideClick: false
}).then(response => {
    user = response.value;
})


//Enviar un mensaje a nuestro servidor
const chatForm = document.getElementById("chatForm");

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("formulario enviado")
    const message = {
        author: user,
        date: new Date().toLocaleString(),
        text: document.getElementById("messageChat").value
    }
    //Envia nuevo mensaje
    socketClient.emit("newMsg", message);
    chatForm.reset();
})