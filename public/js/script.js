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


// Lắng nghe sự kiện change trên các select color, capacity, repayment

if(document.querySelector('#color-1') || document.querySelector('#capacity-1') || document.querySelector('#repayment-1') || document.getElementById('free-sms') || document.getElementById('free-minutes') || document.getElementById('free-gb')){
    document.querySelector('#color-1').addEventListener('change', updatePrice);
    document.querySelector('#capacity-1').addEventListener('change', updatePrice);
    document.querySelector('#repayment-1').addEventListener('change', updatePrice);
    
    document.getElementById('free-sms').addEventListener('onchange', updatePrice);
    document.getElementById('free-minutes').addEventListener('onchange', updatePrice);
    document.getElementById('free-gb').addEventListener('onchange', updatePrice);
}
function updatePrice() {

    let discountElement = document.querySelector('#discountPercentage')
    let discountText  = discountElement.textContent;
    let discountPercentage = parseFloat(discountText.replace('%', ''));

    console.log(discountPercentage);
    // Lấy giá của color, capacity, repayment đã chọn
    const color = document.querySelector('#color-1');
    const capacity = document.querySelector('#capacity-1');
    const repayment = document.querySelector('#repayment-1');


    const freeSMS = document.getElementById('free-sms');
    const freeMinutes = document.getElementById('free-minutes');
    const freeGB = document.getElementById('free-gb');



    const priceNew = document.querySelector('#priceNew');
    const priceNew2 = document.querySelector('#priceNew-2');   // Giá mới của sản phẩm
    const priceOld = document.querySelector('#priceOld'); 
    let newPrice = parseFloat(priceNew.textContent.replace('$', ''));  // Lấy giá ban đầu, bỏ dấu $
    let newOld = parseFloat(priceOld.textContent.replace('$', '')); 
    // Cộng dồn giá nếu có lựa chọn màu sắc, dung lượng, hoặc trả góp
    if (color) {
        newPrice = 0;
        newOld = 0;
        // newPrice = newPrice - (newPrice * discountPercentage / 100);
        let repaymentMonths = parseInt(repayment.options[repayment.selectedIndex].value) || 1; 

        newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price) * repaymentMonths;
        newOld += parseFloat(capacity.options[capacity.selectedIndex].dataset.price);
        newOld += parseFloat(color.options[color.selectedIndex].dataset.price);
        let freeSmsQuantity = parseInt(document.getElementById('free-sms').value) || 0;
        let freeSmsPrice = parseFloat(freeSMS.getAttribute("sms-price")) || 0; 
        newOld += freeSmsPrice * freeSmsQuantity;
        let freeMinutesQuantity = parseInt(freeMinutes.value) || 0;
        let freeMinutesPrice = parseFloat(freeMinutes.getAttribute("minutes-price")) || 0;
        newOld += freeMinutesPrice * freeMinutesQuantity;
        let freeGbQuantity = parseInt(freeGB.value) || 0;
        let freeGbPrice = parseFloat(freeGB.getAttribute("gb-price")) || 0;
        newOld += freeGbPrice * freeGbQuantity;
        newPrice = newOld - (newOld * discountPercentage / 100);
    }
    if (capacity) {
        newPrice = 0;
        newOld = 0;

        let repaymentMonths = parseInt(repayment.options[repayment.selectedIndex].value) || 1; 

        newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price) * repaymentMonths;
        newOld += parseFloat(capacity.options[capacity.selectedIndex].dataset.price);
        newOld += parseFloat(color.options[color.selectedIndex].dataset.price) ;
        let freeSmsQuantity = parseInt(document.getElementById('free-sms').value) || 0;
        let freeSmsPrice = parseFloat(freeSMS.getAttribute("sms-price")) || 0; 
        newOld += freeSmsPrice * freeSmsQuantity;
        let freeMinutesQuantity = parseInt(freeMinutes.value) || 0;
        let freeMinutesPrice = parseFloat(freeMinutes.getAttribute("minutes-price")) || 0;
        newOld += freeMinutesPrice * freeMinutesQuantity;
        let freeGbQuantity = parseInt(freeGB.value) || 0;
        let freeGbPrice = parseFloat(freeGB.getAttribute("gb-price")) || 0;
        newOld += freeGbPrice * freeGbQuantity;
        newPrice = newOld - (newOld * discountPercentage / 100);
    }
    if (repayment) {
        newPrice = 0;
        newOld = 0;

        let repaymentMonths = parseInt(repayment.options[repayment.selectedIndex].value) || 1; 

        newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price) * repaymentMonths;
 
        newOld += parseFloat(capacity.options[capacity.selectedIndex].dataset.price);
        newOld += parseFloat(color.options[color.selectedIndex].dataset.price);
        let freeSmsQuantity = parseInt(document.getElementById('free-sms').value) || 0;
        let freeSmsPrice = parseFloat(freeSMS.getAttribute("sms-price")) || 0; 
        newOld += freeSmsPrice * freeSmsQuantity;
        let freeMinutesQuantity = parseInt(freeMinutes.value) || 0;
        let freeMinutesPrice = parseFloat(freeMinutes.getAttribute("minutes-price")) || 0;
        newOld += freeMinutesPrice * freeMinutesQuantity;
        let freeGbQuantity = parseInt(freeGB.value) || 0;
        let freeGbPrice = parseFloat(freeGB.getAttribute("gb-price")) || 0;
        newOld += freeGbPrice * freeGbQuantity;
        newPrice = newOld - (newOld * discountPercentage / 100);
    }
    if(freeSMS){
        console.log("OK");
        newPrice = 0;
        newOld = 0;
        let repaymentMonths = parseInt(repayment.options[repayment.selectedIndex].value) || 1; 

        newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price) * repaymentMonths;
        // newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price);
        newOld += parseFloat(capacity.options[capacity.selectedIndex].dataset.price);
        newOld += parseFloat(color.options[color.selectedIndex].dataset.price);
        let freeSmsQuantity = parseInt(document.getElementById('free-sms').value) || 0;
        let freeSmsPrice = parseFloat(freeSMS.getAttribute("sms-price")) || 0; 
        newOld += freeSmsPrice * freeSmsQuantity;
        let freeMinutesQuantity = parseInt(freeMinutes.value) || 0;
        let freeMinutesPrice = parseFloat(freeMinutes.getAttribute("minutes-price")) || 0;
        newOld += freeMinutesPrice * freeMinutesQuantity;
        let freeGbQuantity = parseInt(freeGB.value) || 0;
        let freeGbPrice = parseFloat(freeGB.getAttribute("gb-price")) || 0;
        newOld += freeGbPrice * freeGbQuantity;
        newPrice = newOld - (newOld * discountPercentage / 100);
    }
    if(freeMinutes){
        newPrice = 0;
        newOld = 0;
        let repaymentMonths = parseInt(repayment.options[repayment.selectedIndex].value) || 1; 

        newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price) * repaymentMonths;
        // newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price);
        newOld += parseFloat(capacity.options[capacity.selectedIndex].dataset.price);
        newOld += parseFloat(color.options[color.selectedIndex].dataset.price);
        let freeSmsQuantity = parseInt(document.getElementById('free-sms').value) || 0;
        let freeSmsPrice = parseFloat(freeSMS.getAttribute("sms-price")) || 0; 
        newOld += freeSmsPrice * freeSmsQuantity;
        let freeMinutesQuantity = parseInt(freeMinutes.value) || 0;
        let freeMinutesPrice = parseFloat(freeMinutes.getAttribute("minutes-price")) || 0;
        newOld += freeMinutesPrice * freeMinutesQuantity;
        let freeGbQuantity = parseInt(freeGB.value) || 0;
        let freeGbPrice = parseFloat(freeGB.getAttribute("gb-price")) || 0;
        newOld += freeGbPrice * freeGbQuantity;
        newPrice = newOld - (newOld * discountPercentage / 100);
    }
    if(freeGB){
        newPrice = 0;
        newOld = 0;
        let repaymentMonths = parseInt(repayment.options[repayment.selectedIndex].value) || 1; 

        newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price) * repaymentMonths;
        // newOld += parseFloat(repayment.options[repayment.selectedIndex].dataset.price);
        newOld += parseFloat(capacity.options[capacity.selectedIndex].dataset.price);
        newOld += parseFloat(color.options[color.selectedIndex].dataset.price);
        let freeSmsQuantity = parseInt(document.getElementById('free-sms').value) || 0;
        let freeSmsPrice = parseFloat(freeSMS.getAttribute("sms-price")) || 0; 
        newOld += freeSmsPrice * freeSmsQuantity;
        let freeMinutesQuantity = parseInt(freeMinutes.value) || 0;
        let freeMinutesPrice = parseFloat(freeMinutes.getAttribute("minutes-price")) || 0;
        newOld += freeMinutesPrice * freeMinutesQuantity;
        let freeGbQuantity = parseInt(freeGB.value) || 0;
        let freeGbPrice = parseFloat(freeGB.getAttribute("gb-price")) || 0;
        newOld += freeGbPrice * freeGbQuantity;
        newPrice = newOld - (newOld * discountPercentage / 100);
    }

    // Cập nhật giá sản phẩm
    priceNew.textContent = `${newPrice.toFixed(2)}$`;  // Hiển thị lại giá mới
    priceOld.textContent = `${newOld.toFixed(2)}$`;
    priceNew2.value = `${newPrice.toFixed(2)}$`;
}

let couponCode = document.getElementById("couponCode");

if(couponCode){
    const couponCodeInput = document.getElementById('couponCode');
  const totalPriceElement = document.getElementById('total-price-discount');
  const discountMessage = document.createElement('p');
  discountMessage.className = 'text-success font-weight-bold text-right';
  totalPriceElement.insertAdjacentElement('afterend', discountMessage);
  let originalTotal = parseFloat(totalPriceElement.textContent.replace(/[^0-9.-]+/g, ''));

  couponCodeInput.addEventListener('input', (event) => {
    const couponCode = event.target.value.trim();
    if (couponCode === 'HappyNewYear') {
      const discountedTotal = originalTotal * 0.9; // Apply 10% discount
      totalPriceElement.textContent = `Total Orders: ${discountedTotal.toLocaleString()}$`;
      discountMessage.textContent = 'Discount applied: 10% with code "HappyNewYear".';
    } else {
      totalPriceElement.textContent = `Total Orders: ${originalTotal.toLocaleString()}$`;
      discountMessage.textContent = '';
    }
  });
      
    }

const sortSelect = document.querySelector('[sort-select]');
    if(sortSelect){
        let url = new URL(location.href); // Duplicate url
        sortSelect.addEventListener('change', function(){
            const value = sortSelect.value;
            if(value){
                const [sortKey, sortValue] = value.split('-');
                url.searchParams.set('sortKey', sortKey);
                url.searchParams.set('sortValue', sortValue);
                
            } else{
                url.searchParams.delete('sortKey');
                url.searchParams.delete('sortValue');
            }
            location.href = url;
        });
    
        const sortKeyCurrent = url.searchParams.get('sortKey');
        const sortValueCurrent = url.searchParams.get('sortValue');
        if(sortKeyCurrent && sortValueCurrent){
            sortSelect.value = `${sortKeyCurrent}-${sortValueCurrent}`;
        }
    }

const listButtonPagination = document.querySelectorAll('[button-pagination]');
    if(listButtonPagination.length > 0){
        let url = new URL(location.href);
        listButtonPagination.forEach(button => {
            button.addEventListener('click', function(){
                const value = button.getAttribute('button-pagination');
                if(value){
                    url.searchParams.set('page', value);
                } else{
                    url.searchParams.delete('page');
                }
                location.href = url.href; 
    
            })
        })
    
            const pageCurrent = url.searchParams.get("page") || 1;
            const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
            if(buttonCurrent) {
                buttonCurrent.parentElement.classList.add("active");
            }
    }