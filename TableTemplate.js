'use strict'
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// //
// // // Create a new virtual DOM
// const dom = new JSDOM('<!DOCTYPE html><html><body><div id="table">Hello, DOM!</div></body></html>');
// const document = dom.window.document;

class TableTemplate {
    static fillIn(id, dictionary, columnName) {
        const table = document.getElementById(id);
        if (!table) {
            console.error(`Table with ID "${id}" not found.`);
            return;
        }

        const rows = table.rows;

        if (rows.length === 0) {
            console.error(`Table with ID "${id}" has no rows.`);
            return;
        }

        // Process the header row for column names
        const headerRow = rows[0];
        this._processRow(headerRow, dictionary);

        // If a columnName is specified, find its index
        let columnIndex = -1;
        if (columnName) {
            for (let i = 0; i < headerRow.cells.length; i++) {
                if (headerRow.cells[i].textContent.trim() === columnName) {
                    columnIndex = i;
                    break;
                }
            }
        }

        // Process each row with the specified columnName
        for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
            const currentRow = rows[rowIndex];

            // Check if the columnIndex is valid
            if (columnIndex >= 0 && columnIndex < currentRow.cells.length) {
                this._processRow(currentRow, dictionary, columnIndex);
            }
        }

        // Make the table visible if it's hidden
        if (table.style.visibility === 'hidden') {
            table.style.visibility = 'visible';
        }
    }

    static _processRow(row, dictionary, columnIndex) {
        const cells = row.cells;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const cellContent = cell.textContent;
            const replacedContent = this._replaceTemplates(cellContent, dictionary);
            cell.textContent = columnIndex === undefined ? replacedContent : i === columnIndex ? replacedContent : cellContent;
        }
    }

    static _replaceTemplates(text, dictionary) {
        return text.replace(/{{\s*([\w.]+)\s*}}/g, (match, prop) => {
            if (dictionary.hasOwnProperty(prop)) {
                return dictionary[prop];
            }
            return '';
        });
    }
}
