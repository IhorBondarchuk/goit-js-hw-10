import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', handlerSubmitForm);


function promise(state, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            }
            else {
                reject(delay);
            }
        }, delay);
    })
}

function handlerSubmitForm(evt) {
    evt.preventDefault();
    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;

    if (!Number(delay) || delay < 0) {
        iziToast.error({
            message: "Enter a valid delay",
            position: 'topRight'
        });
        return;
    }
    else if (state !== "fulfilled" && state !== "rejected") {
        iziToast.error({
            message: "Choose a state (fulfilled/rejected)",
            position: "topRight"
        });
        return;
    }
    promise(state, delay)
        .then(delay => {
            iziToast.success({
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: "topRight"
            });
        })
        .catch(delay => {
            iziToast.error({
                message: `❌ Rejected promise in ${delay}ms`,
                position: "topRight"
            });
    })
}