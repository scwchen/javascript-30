let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const inputMinutes = document.querySelector('input[name]');
const buttons = document.querySelectorAll('[data-time]');

const timer = (seconds) => {
  clearInterval(countdown);
  // setInterval(()=>{
  //   seconds--;
  // }, 1000);
  // Safari will pause all intervals when scrolling so a simple setInterval will not work
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // Display time
    displayTimeLeft(secondsLeft);
  }, 1000);
}

const displayTimeLeft = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${String(secs).padStart(2, '0')}`;

  // Wes does it a more manual but equally logical way. His way requires no knowledge of the padStart method but it does require knowledge of ternary operators
  // const display = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  document.title = display;
  timerDisplay.textContent = display;
}

const displayEndTime = (timestamp) => {
  const end = new Date(timestamp);
  const hours = end.getHours();
  const newHours = hours > 12 ? hours % 12 : hours;
  // const period = hours >= 12 ? "PM" : "AM"; 
  // Not strictly needed but a nice add on if you wanted to
  const minutes = String(end.getMinutes()).padStart(2, '0');
  endTime.textContent = `Be back at ${hours > 12 ? hours % 12 : hours}:${minutes}`;
}

buttons.forEach(button => {
  button.addEventListener('click', e => {
    timer(e.target.dataset.time);
  })
});

document.customForm.addEventListener('submit', e => {
  e.preventDefault();
  const userSeconds = e.target.minutes.value * 60;
  timer(userSeconds);
  e.target.reset();
});