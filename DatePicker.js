'use strict';
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
//
// // // Create a new virtual DOM
// const dom = new JSDOM('<!DOCTYPE html><body><div id="id">Hello, DOM!</div></body></html>');
// const document = dom.window.document;
class DatePicker {
    constructor(divId, dateSelectedCallback) {
        this.divId = divId;
        this.dateSelectedCallback = dateSelectedCallback;
        this.selectedDate = null;
    }

    render(monthToShow) {
        const container = document.getElementById(this.divId);
        if (!container) {
            console.error("Container not found with id:", this.divId);
            return;
        }

        // Clear the container
        container.innerHTML = '';

        // Create the calendar header
        const header = document.createElement('div');
        header.classList.add('calendar-header');
        container.appendChild(header);

        // Create the previous and next month buttons
        const prevButton = document.createElement('button');
        prevButton.classList.add('control-button');
        prevButton.textContent = '<';
        prevButton.addEventListener('click', () => {
            monthToShow.setMonth(monthToShow.getMonth() - 1);
            this.render(monthToShow);
        });
        header.appendChild(prevButton);

        // Create the month and year display
        const monthYearDisplay = document.createElement('div');
        monthYearDisplay.classList.add('month-year-display');
        monthYearDisplay.textContent = this.getMonthYearString(monthToShow);
        header.appendChild(monthYearDisplay);

        const nextButton = document.createElement('button');
        nextButton.classList.add('control-button');
        nextButton.textContent = '>';
        nextButton.addEventListener('click', () => {
            monthToShow.setMonth(monthToShow.getMonth() + 1);
            this.render(monthToShow);
        });
        header.appendChild(nextButton);

        // Create the calendar grid
        const calendarGrid = document.createElement('table');
        calendarGrid.classList.add('calendar-grid');
        container.appendChild(calendarGrid);

        // Create the day header row
        const dayHeaderRow = document.createElement('tr');
        dayHeaderRow.classList.add('day-header-row');
        calendarGrid.appendChild(dayHeaderRow);

        const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        dayNames.forEach(dayName => {
            const dayHeaderCell = document.createElement('th');
            dayHeaderCell.textContent = dayName;
            dayHeaderRow.appendChild(dayHeaderCell);
        });

        // Calculate the first day of the month
        const firstDayOfMonth = new Date(monthToShow.getFullYear(), monthToShow.getMonth(), -1);
        const startingDay = firstDayOfMonth.getDay();

        // Calculate the last day of the month
        const lastDayOfMonth = new Date(monthToShow.getFullYear(), monthToShow.getMonth() + 1, 0);
        const totalDays = lastDayOfMonth.getDate();

        // Create the calendar cells
        let currentDay = 1;
        for (let i = 0; i < 6; i++) { // Create up to 6 rows for the calendar
            if (currentDay > totalDays) {
                break;
            }
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) { // Create 7 cells for each row
                const cell = document.createElement('td');
                if (i === 0 && j < startingDay) {
                    // Cell belongs to the previous month
                    cell.classList.add('previous-month-day');
                    const lastMonthDay = " ";
                    cell.textContent = lastMonthDay;
                } else if (currentDay <= totalDays) {
                    // Cell belongs to the current month
                    cell.classList.add('current-month-day');
                    cell.textContent = currentDay;
                    cell.addEventListener('click', () => {
                        const selectedDate = {
                            year: monthToShow.getFullYear(),
                            month: monthToShow.getMonth() + 1,
                            day: parseInt(cell.textContent),
                        };
                        this.dateSelectedCallback(this.divId, selectedDate);
                    });
                    currentDay++;
                } else {
                    // Cell belongs to the next month
                    cell.classList.add('next-month-day');
                    const nextMonthDay = " ";
                    cell.textContent = nextMonthDay;
                }
                row.appendChild(cell);
            }
            calendarGrid.appendChild(row);
        }
    }

    getMonthYearString(date) {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString(undefined, options);
    }
}
