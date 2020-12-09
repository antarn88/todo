"use strict";

const todoObject = {
    pendingItemsCounter: Object.values(localStorage).length,
    numberPad(number) { return number < 10 ? `0${number}` : number },
    nowDate() { return new Date() },
    getInputField() { return document.querySelector(".input-field") },
    getAddButton() { return document.querySelector(".add-btn") },
    getPendingItemsContainer() { return document.querySelector(".pending-items-container") },
    getBottomButtons() { return document.querySelector(".bottom-buttons-container") },
    addItemToLocalStorage(item_text) { localStorage.setItem(this.pendingItemsCounter, item_text) },
    getPendingItems() { return Object.keys(localStorage).sort().map(k => localStorage.getItem(k)) },
    insertItemToContainer(text, index) {
        const pendingItem = `<div class="pending-item">
                                <input type="checkbox" id="item-${index}">
                                <label for="item-${index}">${text}</label>
                                <button class="delete-btn">X</button>
                            </div>`
        this.getPendingItemsContainer().insertAdjacentHTML("afterbegin", pendingItem);
    },
    hideBottomButtons() { this.getBottomButtons().style.display = "none" },
    showBottomButtons() { this.getBottomButtons().style.display = "block" },
    setPendingItemsLabel() {
        const label = document.querySelector(".pending-items-label");
        label.textContent = `You have ${todoObject.pendingItemsCounter} pending items`;
    },

};

// Set weekday and date
const getWeekDay = (() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekDay = days[todoObject.nowDate().getDay()];
    const weekDayDiv = document.querySelector(".weekday");
    weekDayDiv.textContent = weekDay;
})();
const getDate = (() => {
    const month = todoObject.numberPad(todoObject.nowDate().getMonth() + 1);
    const day = todoObject.numberPad(todoObject.nowDate().getDate());
    const year = todoObject.nowDate().getFullYear();
    const date = `${month}-${day}-${year}`;
    const dateDiv = document.querySelector(".date");
    dateDiv.textContent = date;
})();

// Check local storage
const checkLocalStorage = (() => {
    if (Object.keys(localStorage).length) {
        Array.from(todoObject.getPendingItems()).map((item, index) => todoObject.insertItemToContainer(item, index));
        todoObject.showBottomButtons();
        todoObject.setPendingItemsLabel();
    } else {
        todoObject.hideBottomButtons();
    }
})();

const addButtonHandler = () => {
    const pendingItem = todoObject.getInputField();
    todoObject.pendingItemsCounter++;
    todoObject.addItemToLocalStorage(pendingItem.value);
    todoObject.insertItemToContainer(pendingItem.value);
    todoObject.setPendingItemsLabel();
    todoObject.showBottomButtons();
    pendingItem.value = "";
};

// Set eventlisteners
const addEventListeners = (() => {
    todoObject.getAddButton().addEventListener("click", addButtonHandler);
})();