"use strict";

const db = {
    createPendingItemsContainer() { if (!localStorage.getItem("Pending-items")) { localStorage.setItem("Pending-items", "{}") } },
    createCompletedTasksContainer() { if (!localStorage.getItem("Completed-tasks")) { localStorage.setItem("Completed-tasks", "") } },
    getPendingItems() { return JSON.parse(localStorage.getItem("Pending-items")) },
    setPendingItems(pendingItemsObjectFormat) { localStorage.setItem("Pending-items", JSON.stringify(pendingItemsObjectFormat)) },
    addPendingItem(key, value) {
        const pendingItems = this.getPendingItems();
        pendingItems[key] = value;
        this.setPendingItems(pendingItems);
    },
    countPendingItems() { return todoObject.padNumber(Object.keys(this.getPendingItems()).length + 1) },
    countPendingItemsWithoutPad() { return Object.keys(this.getPendingItems()).length },
    getCompletedTasks() {
        if (localStorage.getItem("Completed-tasks").length) {
            return localStorage.getItem("Completed-tasks").split("|");
        }
        return "";
    },
    setCompletedTasks(pendingItemText) {
        let getCompletedTaskString = Array.from(this.getCompletedTasks()).join("|");
        if (getCompletedTaskString) {
            getCompletedTaskString += `|${pendingItemText}`;
        } else {
            getCompletedTaskString += `${pendingItemText}`;
        }
        localStorage.setItem("Completed-tasks", getCompletedTaskString);
    },
    countCompletedTasks() { return todoObject.padNumber(this.getCompletedTasks().length) },
    countCompletedTasksWithoutPad() {
        if (this.getCompletedTasks()) {
            return this.getCompletedTasks().length
        }
        return 0;
    },
    countCompletedTasksInPercent() {
        return Math.floor(this.countCompletedTasksWithoutPad() * 100 /
            (this.countPendingItemsWithoutPad() + this.countCompletedTasksWithoutPad()));
    },
    deletePendingItem(buttonId) {
        const pendingItemKey = buttonId.replace("delete-btn-", "");
        const pendingItem = todoObject.getItemFromId(`item-${pendingItemKey}`);
        const pendingItemsObj = db.getPendingItems();
        delete pendingItemsObj[pendingItemKey];
        db.setPendingItems(pendingItemsObj);
        pendingItem.innerHTML = "";

        todoObject.updatePendingItemsContainer();
        todoObject.updateCompletedTasksContainer();
        todoObject.setPendingItemsLabel();
        todoObject.setCompletedTasksLabel();

        if (!this.countPendingItemsWithoutPad()) {
            todoObject.setTimeToChillScreen();
        }
        todoObject.hideItem(todoObject.getCompletedTasksLabel());
    },
};

const todoObject = {
    pendingItemsCounter: 0,
    isHiddenCompletedTasks: true,
    padNumber(number) {
        if (number < 10) { return `00${number}` }
        else if (number >= 10 && number < 100) { return `0${number}` }
    },
    padNumberForDate(number) {
        if (number < 10) { return `0${number}` };
        return number;
    },
    getRandomString() { return Math.random().toString(36).substring(7) },
    showItem(item) {
        item.classList.remove("hide-item");
        item.classList.add("show-item");
    },
    hideItem(item) {
        item.classList.remove("show-item");
        item.classList.add("hide-item");
    },
    nowDate() { return new Date() },
    getOutputContainer() { return document.querySelector(".output-container") },
    getNoTodosDiv() { return document.querySelector(".no-todos") },
    getInputField() { return document.querySelector(".input-field") },
    getAddButton() { return document.querySelector(".add-btn") },
    getPendingItemsContainer() { return document.querySelector(".pending-items-container") },
    getCompletedTasksContainer() { return document.querySelector(".completed-tasks-container") },
    getBottomButtons() { return document.querySelector(".bottom-buttons-container") },
    getPendingItems() { return document.querySelectorAll(".pending-item") },
    getCompletedTasksLabel() { return document.querySelector(".completed-tasks-label") },
    getPendingItemsLabel() { return document.querySelector(".pending-items-label") },
    getPendingItemIdKey(pendingItem) {
        return pendingItem.querySelector("input").getAttribute("id").split("-")
            .filter(item => item !== "item").join("-");
    },
    getPendingItemText(pendingItem) { return pendingItem.querySelector("label").textContent },
    getShowHideCompleteButton() { return document.querySelector(".show-hide-complete-btn") },
    getClearAllButton() { return document.querySelector(".clear-all-btn") },
    setTimeToChillScreen() {
        this.hideItem(this.getPendingItemsLabel());
        this.hideItem(this.getPendingItemsContainer());
        this.hideItem(this.getCompletedTasksLabel());
        this.hideItem(this.getCompletedTasksContainer());
        this.hideItem(this.getBottomButtons());
        this.showItem(this.getNoTodosDiv());
        this.getCompletedTasksContainer().classList.remove("show-item");
        this.getCompletedTasksContainer().classList.add("hide-item");
    },
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
        db.setCompletedTasks(todoObject.getPendingItemText(pendingItem));

        Array.from(todoObject.getPendingItemsContainer()).map(item => { if (item === pendingItem) { pendingItem.innerHTML = "" } });

        this.setPendingItemsLabel();
        this.setCompletedTasksLabel();
        this.insertItemToCompletedTasksContainer(this.getPendingItemText(pendingItem));
        this.updateCompletedTasksContainer();
        this.updatePendingItemsContainer();

        if (!db.countPendingItemsWithoutPad()) { this.setTimeToChillScreen() };
        this.hideItem(this.getCompletedTasksLabel());
    },
    checkboxOnChange() {
        const currentCheckbox = this;
        const pendingItem = this.parentElement;
        todoObject.movePendingItemToCompletedTasksContainer(pendingItem);
        todoObject.setPendingItemsLabel();
    },
    insertItemToPendingItemsContainer(text, index) {
        const pendingItem = `<div class="pending-item">
                                <input type="checkbox" id="item-${index}">
                                <label for="item-${index}">${text}</label>
                                <button class="delete-btn" id="delete-btn-${index}" onClick="db.deletePendingItem(this.id)">🗑️</button>
                            </div>`;
        this.getPendingItemsContainer().insertAdjacentHTML("afterbegin", pendingItem);
        const currentCheckbox = this.getItemFromId(`item-${index}`);
        currentCheckbox.addEventListener("change", this.checkboxOnChange);
        this.addAndRemoveDeleteButton();
    },
    insertItemToCompletedTasksContainer(text) {
        const completedItem = `<div class="completed-item">
                                <input type="checkbox" disabled checked>
                                <label>${text}</label>
                            </div>`;
        this.getCompletedTasksContainer().insertAdjacentHTML("afterbegin", completedItem);
    },
    setPendingItemsLabel() {
        if (db.countPendingItemsWithoutPad()) {
            this.getPendingItemsLabel().textContent = `You have ${db.countPendingItemsWithoutPad()} pending items`;
        } else {
            this.hideItem(this.getPendingItemsLabel());
        }
    },
    setCompletedTasksLabel() {
        if (db.countPendingItemsWithoutPad()) {
            this.showItem(this.getCompletedTasksLabel());
            this.getCompletedTasksLabel().textContent = `Completed tasks: ${db.countCompletedTasksInPercent()}%`;
        } else {
            this.hideItem(this.getCompletedTasksLabel());
        }

        if (db.countCompletedTasksWithoutPad()) {
            this.getCompletedTasksLabel().textContent = `Completed tasks: ${db.countCompletedTasksInPercent()}%`;
        } else {
            this.hideItem(this.getCompletedTasksLabel());
        }
    },
    updateCompletedTasksContainer() {
        this.setCompletedTasksLabel();
        this.getCompletedTasksContainer().textContent = "";
        this.hideItem(this.getCompletedTasksContainer());
        if (db.countCompletedTasksWithoutPad() && db.countPendingItemsWithoutPad()) {
            db.getCompletedTasks().map(task => this.insertItemToCompletedTasksContainer(task));
        }
    },
    updatePendingItemsContainer() {
        this.setPendingItemsLabel();
        this.getPendingItemsContainer().textContent = "";
        this.hideItem(this.getPendingItemsContainer());
        if (db.countPendingItemsWithoutPad()) {
            this.showItem(this.getPendingItemsContainer());
            for (const pendingItem in db.getPendingItems()) {
                const pendingItemText = db.getPendingItems()[pendingItem];
                this.insertItemToPendingItemsContainer(pendingItemText, pendingItem)
            }
        }
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
    const month = todoObject.padNumberForDate(todoObject.nowDate().getMonth() + 1);
    const day = todoObject.padNumberForDate(todoObject.nowDate().getDate());
    const year = todoObject.nowDate().getFullYear();
    const date = `${month}-${day}-${year}`;
    const dateDiv = document.querySelector(".date");
    dateDiv.textContent = date;
})();

// Check local storage
const checkLocalStorage = (() => {
    db.createPendingItemsContainer();
    db.createCompletedTasksContainer();

    todoObject.hideItem(todoObject.getOutputContainer());

    if (db.countPendingItemsWithoutPad()) {
        todoObject.showItem(todoObject.getOutputContainer());
        todoObject.updatePendingItemsContainer();
        todoObject.showItem(todoObject.getBottomButtons());
        if (db.countCompletedTasksWithoutPad()) {
            todoObject.showItem(todoObject.getCompletedTasksContainer());
            todoObject.updateCompletedTasksContainer();
        }
    } else {
        todoObject.hideItem(todoObject.getBottomButtons());
        todoObject.showItem(todoObject.getNoTodosDiv());
    }
    todoObject.hideItem(todoObject.getCompletedTasksLabel());
})();

const addButtonHandler = () => {
    if (todoObject.getInputField().value !== "") {
        todoObject.showItem(todoObject.getOutputContainer());
        todoObject.showItem(todoObject.getPendingItemsLabel());
        const randomString = todoObject.getRandomString();
        const pendingItemInputField = todoObject.getInputField();
        todoObject.pendingItemsCounter++;
        db.addPendingItem(`${db.countPendingItems()}-${randomString}`, pendingItemInputField.value);
        todoObject.insertItemToPendingItemsContainer(pendingItemInputField.value,
            `${todoObject.padNumber(todoObject.pendingItemsCounter)}-${randomString}`);
        todoObject.setPendingItemsLabel();
        todoObject.showItem(todoObject.getPendingItemsContainer());
        todoObject.showItem(todoObject.getBottomButtons());
        todoObject.hideItem(todoObject.getNoTodosDiv());
        pendingItemInputField.value = "";
        todoObject.updateCompletedTasksContainer();
        todoObject.hideItem(todoObject.getCompletedTasksLabel());

        if (todoObject.isHiddenCompletedTasks) {
            todoObject.hideItem(todoObject.getCompletedTasksLabel());
            todoObject.hideItem(todoObject.getCompletedTasksContainer());
        } else {
            todoObject.showItem(todoObject.getCompletedTasksLabel());
            todoObject.showItem(todoObject.getCompletedTasksContainer());
        }

    } else {
        alert("The value of the input field cannot be empty!");
        todoObject.getInputField().focus();
    }
};

const clearAllBtnHandler = () => {
    localStorage.setItem("Pending-items", "{}");
    todoObject.showItem(todoObject.getNoTodosDiv());
    todoObject.hideItem(todoObject.getCompletedTasksContainer());
    todoObject.hideItem(todoObject.getPendingItemsContainer());
    todoObject.hideItem(todoObject.getBottomButtons());
    todoObject.updatePendingItemsContainer();
    todoObject.updateCompletedTasksContainer();
    todoObject.setPendingItemsLabel();
    todoObject.setCompletedTasksLabel();
};

const showHideCompleteBtnHandler = (ev) => {
    const button = ev.currentTarget;
    button.classList.toggle("show");

    if (button.classList.contains("show")) {
        todoObject.showItem(todoObject.getCompletedTasksLabel());
        todoObject.showItem(todoObject.getCompletedTasksContainer());
        todoObject.isHiddenCompletedTasks = false;
        button.textContent = "Hide Complete";
    } else {
        todoObject.hideItem(todoObject.getCompletedTasksLabel());
        todoObject.hideItem(todoObject.getCompletedTasksContainer());
        todoObject.isHiddenCompletedTasks = true;
        button.textContent = "Show Complete";
    }
};

// Set eventlisteners
const addEventListeners = (() => {
    todoObject.getAddButton().addEventListener("click", addButtonHandler);
    todoObject.getClearAllButton().addEventListener("click", clearAllBtnHandler);
    todoObject.getShowHideCompleteButton().addEventListener("click", showHideCompleteBtnHandler);
})();