import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const elements = {
    inputPicker: document.querySelector('input#datetime-picker'),
    startBtn: document.querySelector('button[data-start]'),
    daysValue: document.querySelector('span[data-days]'),
    hoursValue: document.querySelector('span[data-hours]'),
    minutesValue: document.querySelector('span[data-minutes]'),
    secondsValue: document.querySelector('span[data-seconds]')
};

elements.startBtn.addEventListener('click', handlerDateSelection);
elements.startBtn.disabled = true;

let endDateValue = null;
let dateValue;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      endDateValue = selectedDates[0].getTime();
      const nowDate = Date.now();
      if (endDateValue <= nowDate) {
          iziToast.error({
              message: 'Please choose a date in the future',
              position: 'topRight'
          });
          endDateValue = null;
          return;
      }
    else {
          elements.startBtn.disabled = false;
          iziToast.success({
              message: "Date is valid, you can start the timer",
              position: "topRight"
          })
    }
  },
};

dateValue = flatpickr(elements.inputPicker, options);

function handlerDateSelection() {
    if (!endDateValue) {
        iziToast.error({
            message: "Date not seleected",
            position: "topRight"
        })
        return;
    }
    
    
    elements.startBtn.disabled = true;
    elements.inputPicker.disabled = true;
    const startTime = Date.now();

    const timerId = setInterval(() => {
        const startDate = Date.now();
        const ms = endDateValue - startDate;
        const remaningTime = convertMs(ms);
        updateClockValue(remaningTime);
    }, 1000);

    setTimeout(() => {
        iziToast.success({
            message: "FINISH",
            position: "topRight"
        })
        clearInterval(timerId);
        elements.inputPicker.disabled = false;
    }, endDateValue - startTime);
    
};

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
};

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = addLeadingZero(Math.floor(ms / day));
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));
    return { days, hours, minutes, seconds };
}

function updateClockValue({days, hours, minutes, seconds}) {
    elements.daysValue.textContent = `${days}`;
    elements.hoursValue.textContent = `${hours}`;
    elements.minutesValue.textContent = `${minutes}`;
    elements.secondsValue.textContent = `${seconds}`;
}

