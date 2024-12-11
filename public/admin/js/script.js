const boxFilter = document.querySelector('[box-filter]');
if(boxFilter){
    let url = new URL(location.href); // Duplicate url
    boxFilter.addEventListener('change', function(){
        const value = boxFilter.value;
        if(value){
            url.searchParams.set('status', value);
        } else{
            url.searchParams.delete('status');
        }
        location.href = url;
    });

    const statusCurrent = url.searchParams.get('status');
    if(statusCurrent){
        boxFilter.value = statusCurrent;
    }
}

// Search
const formSearch = document.querySelector('[form-search]');
if(formSearch){
    let url = new URL(location.href); 
    formSearch.addEventListener('submit', function(event){
        event.preventDefault();
        const value = formSearch.keyword.value;
        if(value){
            url.searchParams.set('keyword', value);
        }
        else{
            url.searchParams.delete('keyword');
        }
        location.href = url;
    });

    const valueCurrent = url.searchParams.get('keyword'); 
    if(valueCurrent){
        formSearch.keyword.value = valueCurrent;
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

const listButtonChangeStatus = document.querySelectorAll('[button-change-status]');
if(listButtonChangeStatus.length > 0){
    listButtonChangeStatus.forEach(button => {
        button.addEventListener('click', function(){
            const id = button.getAttribute('item-id');
            const status = button.getAttribute('button-change-status');
            const data = {
                id: id,
                status: status
            };
            const path = button.getAttribute('data-path');

            fetch(path, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if(data.code === 200){
                    location.reload();
                }
            })
        })
    })
}


const formChangeMulti = document.querySelector('[form-change-multi]');
if(formChangeMulti){
    formChangeMulti.addEventListener('submit', function(event){
        event.preventDefault();
        const path = formChangeMulti.getAttribute('data-path');
        const status = formChangeMulti.status.value;
        if(status == "delete"){
            const isConfirm = confirm('Are you sure to delete the record?');
            if(!isConfirm){
                return;
        }
    }
        const ids = [];
        const listInputChange = document.querySelectorAll('[input-change]:checked');
        listInputChange.forEach(input => {
            ids.push(input.getAttribute('input-change'))
        });
        const data = {
            ids: ids,
            status: status
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
}

const listButtonDelete = document.querySelectorAll('[button-delete]');
if(listButtonDelete.length > 0){
    listButtonDelete.forEach(button => {
        button.addEventListener('click', function(){
            const isConfirm = confirm('Are you sure to delete the record?');
            if(isConfirm){
                const id = button.getAttribute('item-id');
                const data = {
                    id: id
                };
                const path = button.getAttribute('data-path');
                fetch(path, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if(data.code === 200){
                        location.reload();
                    }
                })
            }

        })
    })
}


const listInputPosition = document.querySelectorAll('.input-position');
if(listInputPosition.length > 0){
    listInputPosition.forEach(input => {
        input.addEventListener('change', function(){
            const value = parseInt(input.value);
            const id = input.getAttribute('item-id');
            const path = input.getAttribute('data-path');

            const data = {
                id: id,
                position: value
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
                if(data.code === 200){
                    location.reload();
                }
            })

        })
    })
}


const alertMessage = document.querySelector('[alert-message]');
if(alertMessage){
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}

const uploadImage = document.querySelector('[upload-image]');
if(uploadImage){
    const imagePreview = document.querySelector('[upload-image-preview]');
    const imageInput = document.querySelector('[upload-image-input]');
    imageInput.addEventListener('change', function(){
        const file = imageInput.files[0];
        if (file) {
            imagePreview.src = URL.createObjectURL(file)
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


const tablePermission = document.querySelector('[table-permissions]');
if (tablePermission) {
   const buttionSubmit = document.querySelector('[button-submit]');
    buttionSubmit.addEventListener('click', function(){
        const dataFinal = [];
        const listElementRoleId = document.querySelectorAll('[role-id]');
        listElementRoleId.forEach(element => {
            const roleId = element.getAttribute('role-id');
            const permissions = [];
            const listInputChecked = document.querySelectorAll(`input[data-id="${roleId}"]:checked`);
            listInputChecked.forEach(input => {
                const tr = input.closest(`tr[data-name]`);
                const name = tr.getAttribute('data-name');
                permissions.push(name);
            });
            dataFinal.push({
                roleId: roleId,
                permissions: permissions
            });
        })
        const path = buttionSubmit.getAttribute('data-path');

        fetch(path, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataFinal)
        })
        .then(response => response.json())
        .then(data => {
            if(data.code === 200){
                location.reload();
            }
        })
    })
    let dataPermissions = tablePermission.getAttribute('table-permissions');
    dataPermissions = JSON.parse(dataPermissions);
    dataPermissions.forEach(item => {
        item.permissions.forEach(permission => {
            const input = document.querySelector(`tr[data-name="${permission}"] input[data-id="${item._id}"]`);
            input.checked = true;
        });
    });
}


   // JavaScript để tạo các input màu và giá linh động
document.getElementById('num-options').addEventListener('change', function(e) {
    let numOptions = e.target.value;
    let container = document.getElementById('input-container');
    container.innerHTML = ''; // Reset vùng nhập liệu

    // Tạo các input theo số lượng màu và giá
    for (let i = 1; i <= numOptions; i++) {
      let colorInput = document.createElement('div');
      colorInput.innerHTML = `
        <label for="name_color${i}">Color ${i}</label>
        <input type="text" class="form-control" id="name_color${i}" name="name_color${i}" required>
        <label for="price_color${i}">Price ${i}</label>
        <input type="number" class="form-control" id="price_color${i}" name="price_color${i}" required>
      `;
      container.appendChild(colorInput);
    }
  });


    // JavaScript để tạo các input màu và giá linh động
document.getElementById('num-options-2').addEventListener('change', function(e) {
        console.log('change');
        let numOptions = e.target.value;
        let container = document.getElementById('input-container-2');
        container.innerHTML = ''; // Reset vùng nhập liệu
    
        // Tạo các input theo số lượng màu và giá
        for (let i = 1; i <= numOptions; i++) {
          let capacityInput = document.createElement('div');
          capacityInput.innerHTML = `
            <label for="name_capacity${i}">Capacity ${i}</label>
            <input type="text" class="form-control" id="name_capacity${i}" name="name_capacity${i}" required>
            <label for="price_capacity${i}">Price ${i}</label>
            <input type="number" class="form-control" id="price_capacity${i}" name="price_capacity${i}" required>
          `;
          container.appendChild(capacityInput);
        }
      });

    // JavaScript để tạo các input màu và giá linh động
document.getElementById('num-options-3').addEventListener('change', function(e) {
        console.log('change');
        let numOptions = e.target.value;
        let container = document.getElementById('input-container-3');
        container.innerHTML = ''; // Reset vùng nhập liệu
    
        // Tạo các input theo số lượng màu và giá
        for (let i = 1; i <= numOptions; i++) {
          let capacityInput = document.createElement('div');
          capacityInput.innerHTML = `
            <label for="name_repayment${i}">Repayment ${i}</label>
            <input type="text" class="form-control" id="name_repayment${i}" name="name_repayment${i}" required>
            <label for="price_repayment${i}">Price ${i}</label>
            <input type="number" class="form-control" id="price_repayment${i}" name="price_repayment${i}" required>
          `;
          container.appendChild(capacityInput);
        }
      });


      



    
 




