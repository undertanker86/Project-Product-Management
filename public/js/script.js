// table-cart
const tableCart = document.querySelector("[table-cart]");
if(tableCart){
    const listInputQuantity = tableCart.querySelectorAll("input[name='quantity']");
    listInputQuantity.forEach(input => {
        input.addEventListener("change", function(){
            const productId = input.getAttribute('item-id');
            const quantity = input.value;
            const path = "/cart/update";
            const data = {
                productId: productId,
                quantity: quantity
            };
            fetch(path, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.code === 200){
                    location.reload();
                }
            })
        });
    });
}
// end table-cart

// alert-message
const alertMessage = document.querySelector('[alert-message]');
if(alertMessage){
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}
// End alert-message