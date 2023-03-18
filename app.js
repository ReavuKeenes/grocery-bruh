// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')
const heading = document.getElementById('heading')

// edit option
let editElement
let editFlag = false

// localization (default SK)
const itemAddedText = 'položka pridaná'
const itemEditedText = 'položka upravená'
const itemRemovedText = 'položka odstránená'
const inputValueText = 'zadaj názov položky'
const allItemsRemovedText = 'všetky položky odstránené'
const addBtnText = 'pridaj'
const editBtnText = 'ulož'
grocery.setAttribute('placeholder', 'pridaj napr. avokádo')
heading.textContent = 'nákupný buddy'
clearBtn.textContent = 'vymaž zoznam'
submitBtn.textContent = addBtnText

// ****** FUNCTIONS **********
const addItem = (e) => {
  e.preventDefault()
  const value = grocery.value
  const id = new Date().getTime().toString()

  if (value && !editFlag) {
    // set an article that contains single item
    setItem(id, value)
    displayAlert(itemAddedText, 'success')
    container.classList.add('show-container')
    // add to local storage
    addToLocalStorage(id, value)
    // set back to default
    setBackToDefault()
  } else if (value && editFlag) {
    editElement.innerHTML = value
    const id = editElement.parentElement.dataset.id
    displayAlert(itemEditedText, 'success')
    editLocalStorage(id, value)
    setBackToDefault()
  } else displayAlert(inputValueText, 'danger')
}

displayAlert = (text, type) => {
  alert.textContent = text
  alert.classList.add(`alert-${type}`)
  setTimeout(() => {
    alert.textContent = ''
    alert.classList.remove(`alert-${type}`)
  }, 1000)
}

// delete item
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  list.removeChild(element)
  if (list.children.length === 0) container.classList.remove('show-container')
  displayAlert(itemRemovedText, 'danger')
  setBackToDefault()
  // remove from localStorage
  removeFromLocalStorage(id)
}

// edit item
const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement
  // set edit item
  editElement = element.firstChild
  // set form value
  grocery.focus()
  grocery.value = editElement.textContent
  editFlag = true
  submitBtn.textContent = editBtnText
}

// clear items
const clearItems = () => {
  const items = document.querySelectorAll('.grocery-item')
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert(allItemsRemovedText, 'success')
  setBackToDefault()
  localStorage.removeItem('list')
}

const setBackToDefault = () => {
  grocery.value = ''
  editFlag = false
  submitBtn.textContent = addBtnText
}

// ****** LOCAL STORAGE **********
const addToLocalStorage = (id, value) => {
  const grocery = { id, value }
  let items = getLocalStorage()
  items.push(grocery)
  setLocalStorage(items)
}

const editLocalStorage = (id, value) => {
  let items = getLocalStorage()
  items = items.map((item) => {
    if (item.id === id) item.value = value
    return item
  })
  setLocalStorage(items)
}

const removeFromLocalStorage = (id) => {
  let items = getLocalStorage()
  items = items.filter((item) => {
    if (item.id !== id) return item
  })
  if (items.length === 0) localStorage.removeItem('list')
  else setLocalStorage(items)
}

const setLocalStorage = (items) => localStorage.setItem('list', JSON.stringify(items))

const getLocalStorage = () =>
  localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []

// ****** SETUP ITEMS **********
const setItem = (id, value) => {
  const element = document.createElement('article')
  element.classList.add('grocery-item')
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
  // delete item
  const deleteBtn = element.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', deleteItem, element)
  // edit item
  const editBtn = element.querySelector('.edit-btn')
  editBtn.addEventListener('click', editItem)
  list.appendChild(element)
}

const setupItems = () => {
  const items = getLocalStorage()
  if (items.length > 0) {
    items.forEach((item) => setItem(item.id, item.value))
    container.classList.add('show-container')
  }
}

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)
// load items at the page reload
window.addEventListener('DOMContentLoaded', setupItems)
