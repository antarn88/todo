"use strict";

const numberPad = (number) => number < 10 ? `0${number}` : number;
const nowDate = () => new Date();

const getWeekDay = (() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekDay = days[nowDate().getDay()];
    const weekDayDiv = document.querySelector(".weekday");
    weekDayDiv.textContent = weekDay;
})();

const getDate = (() => {
    const month = numberPad(nowDate().getMonth() + 1);
    const day = numberPad(nowDate().getDate());
    const year = nowDate().getFullYear();
    const date = `${month}-${day}-${year}`;
    const dateDiv = document.querySelector(".date");
    dateDiv.textContent = date;
})();
