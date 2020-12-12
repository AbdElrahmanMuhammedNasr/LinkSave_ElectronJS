const {ipcRenderer} = require('electron');
let showModel = document.getElementById('show-model')
let closeModel = document.getElementById('cancel')
let model = document.getElementById('model')
let addItem = document.getElementById('add-item')
let urlEle = document.getElementById('url')
let search = document.getElementById('search')

// filter
search.addEventListener('keyup', e => {
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        // hide others
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    })
})

// end filte


const toggleAddButton = () => {
    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModel.style.display = 'inline';

    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModel.style.display = 'none';
    }
}

showModel.addEventListener('click', e => {
    model.style.display = 'flex';
    urlEle.focus();
})

closeModel.addEventListener('click', e => {
    model.style.display = 'none'
})

addItem.addEventListener('click', e => {
    if (urlEle.value) {
        ipcRenderer.send('new-item', urlEle.value)
        toggleAddButton()
    }
})

// get data from index
ipcRenderer.on('new-item-success', (e, newItem) => {
    addItemToModel(newItem, true);
    toggleAddButton();
    urlEle.innerText = '';
    model.style.display = 'none';

})

urlEle.addEventListener('keyup', e => {
    if (e.key === 'Enter') addItem.click()
})


// -----------------------------------------------------
// adding element
let itemsContainer = document.getElementById('items')

// add to storage
let storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// save it
function save() {
    localStorage.setItem('readit-items', JSON.stringify(storage))
}

function addItemToModel(item, isNew = false) {
    //create div
    let itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'read-item');
    itemNode.innerHTML = `<img src="${item.screenShot}"> <h5>${item.title}</h5>`

    // add this to 'items' container
    itemsContainer.appendChild(itemNode)


    // save it if it is 'new'
    if (isNew) {
        storage.push(item);
        save();
    }
    // itemNode.addEventListener('dblclick',e=>{
    //     itemsContainer.removeChild(itemsContainer.childNodes[e])
    //
    //     storage.splice(itemNode.,1)
    //     save();
    // })
    itemNode.addEventListener('click',e=>{
        window.open(item.url,'',`
            maxWidth:2000,
            maxHeight:2000,
            width:2000,
            height:800,
            nodeIntegration=0
        `)
    })


}

// add item from local
storage.forEach(item => {
    addItemToModel(item, false);
})

