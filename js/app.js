"use strict";

const db = {
    createPendingItemsContainer() { if (!localStorage.getItem("Pending-items")) { localStorage.setItem("Pending-items", "{}") } },
    createCompletedTasksContainer() { if (!localStorage.getItem("Completed-tasks")) { localStorage.setItem("Completed-tasks", "{}") } },
    getPendingItems() { return JSON.parse(localStorage.getItem("Pending-items")) },
    setPendingItems(pendingItemsObjectFormat) { localStorage.setItem("Pending-items", JSON.stringify(pendingItemsObjectFormat)) },
    addPendingItem(key, value) {
        const pendingItems = this.getPendingItems();
        pendingItems[key] = value;
        this.setPendingItems(pendingItems);
    },
    countPendingItems() { return todoObject.padNumber(Object.keys(this.getPendingItems()).length + 1) },
    countPendingItemsWithoutPad() { return Object.keys(this.getPendingItems()).length },

    getCompletedTasks() { return JSON.parse(localStorage.getItem("Completed-tasks")) },
    setCompletedTasks(completedTasksObjectFormat) { localStorage.setItem("Completed-tasks", JSON.stringify(completedTasksObjectFormat)) },
    addCompletedTask(key, value) {
        const completedTasks = this.getCompletedTasks();
        completedTasks[key] = value;
        this.setCompletedTasks(completedTasks);
    },
    countCompletedTasks() { return todoObject.padNumber(Object.keys(this.getCompletedTasks()).length + 1) },
};

const todoObject = {
    pendingItemsCounter: 0,
    padNumber(number) { return number < 10 ? `0${number}` : number },
    nowDate() { return new Date() },
    getInputField() { return document.querySelector(".input-field") },
    getAddButton() { return document.querySelector(".add-btn") },
    getPendingItemsContainer() { return document.querySelector(".pending-items-container") },
    getCompletedTasksContainer() { return document.querySelector(".completed-tasks-container") },
    getBottomButtons() { return document.querySelector(".bottom-buttons-container") },
    getPendingItems() { return document.querySelectorAll(".pending-item") },
    getPendingItemIdKey(pendingItem) { return pendingItem.querySelector("input").getAttribute("id").split("-")[1] },
    getPendingItemText(pendingItem) { return pendingItem.querySelector("label").textContent },
    addAndRemoveDeleteButton() {
        Array.from(this.getPendingItems()).map(item => {
            item.addEventListener("mouseover", () => item.classList.add("show-delete-btn"));
            item.addEventListener("mouseleave", () => item.classList.remove("show-delete-btn"));
        });
    },
    getItemFromId(id) { return this.getPendingItemsContainer().querySelector(`#${id}`) },
    movePendingItemToCompletedTasksContainer(pendingItem) {
        const currentItemKey = todoObject.getPendingItemIdKey(pendingItem);

        const pendingItems = db.getPendingItems();
        delete pendingItems[currentItemKey];
        db.setPendingItems(pendingItems);

        const completedTasks = db.getCompletedTasks();
        completedTasks[currentItemKey] = todoObject.getPendingItemText(pendingItem);
        db.setCompletedTasks(completedTasks);

        Array.from(this.getPendingItems()).map(item => {
            if (item === pendingItem) {
                item.style.display = "none";
            }
        });

        pendingItem.style.display = "block";
        this.getCompletedTasksContainer().appendChild(pendingItem);

    },
    checkboxOnChange() {
        const currentCheckbox = this;
        const pendingItem = this.parentElement;
        todoObject.movePendingItemToCompletedTasksContainer(pendingItem);
        todoObject.setPendingItemsLabel();
    },
    insertItemToContainer(text, index) {
        const pendingItem = `<div class="pending-item">
                                <input type="checkbox" id="item-${index}">
                                <label for="item-${index}">${text}</label>
                                <button class="delete-btn">X</button>
                            </div>`;
        this.getPendingItemsContainer().insertAdjacentHTML("afterbegin", pendingItem);
        const currentCheckbox = this.getItemFromId(`item-${index}`);
        currentCheckbox.addEventListener("change", this.checkboxOnChange);
        this.addAndRemoveDeleteButton();
    },
    hideBottomButtons() { this.getBottomButtons().style.display = "none" },
    showBottomButtons() { this.getBottomButtons().style.display = "block" },
    setPendingItemsLabel() {
        const label = document.querySelector(".pending-items-label");
        db.countPendingItemsWithoutPad() === 0 ? label.textContent = "" :
            label.textContent = `You have ${db.countPendingItemsWithoutPad()} pending items`;
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
    const month = todoObject.padNumber(todoObject.nowDate().getMonth() + 1);
    const day = todoObject.padNumber(todoObject.nowDate().getDate());
    const year = todoObject.nowDate().getFullYear();
    const date = `${month}-${day}-${year}`;
    const dateDiv = document.querySelector(".date");
    dateDiv.textContent = date;
})();

// Check local storage
const checkLocalStorage = (() => {
    db.createPendingItemsContainer();
    db.createCompletedTasksContainer();

    if (Object.keys(db.getPendingItems()).length) {
        for (let pendingItem in db.getPendingItems()) {
            const pendingItemText = db.getPendingItems()[pendingItem];
            todoObject.insertItemToContainer(pendingItemText, pendingItem)
        }
        todoObject.showBottomButtons();
        todoObject.setPendingItemsLabel();
    } else {
        todoObject.hideBottomButtons();
    }

})();

const addButtonHandler = () => {
    const pendingItem = todoObject.getInputField();
    todoObject.pendingItemsCounter++;
    db.addPendingItem(db.countPendingItems(), pendingItem.value);
    todoObject.insertItemToContainer(pendingItem.value, todoObject.padNumber(todoObject.pendingItemsCounter));
    todoObject.setPendingItemsLabel();
    todoObject.showBottomButtons();
    pendingItem.value = "";
};

// Set eventlisteners
const addEventListeners = (() => {
    todoObject.getAddButton().addEventListener("click", addButtonHandler);
})();