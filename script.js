let editIndex = null;
let editMonthYear = null;

document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = new Date(document.getElementById('date').value);
    const collections = parseFloat(document.getElementById('collections').value);
    const rejects = parseFloat(document.getElementById('rejects').value);
    const deliveries = parseFloat(document.getElementById('deliveries').value);
    const variance = parseFloat((deliveries - collections + rejects).toFixed(2));

    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const monthYear = `${month} ${year}`;

    let data = JSON.parse(localStorage.getItem('data')) || {};

    if (editIndex !== null && editMonthYear !== null) {
        // Update existing entry
        data[editMonthYear][editIndex] = { date: date.toISOString().split('T')[0], collections, rejects, deliveries, variance };
        editIndex = null;
        editMonthYear = null;
        document.getElementById('submit-button').textContent = 'Add Entry';
    } else {
        // Add new entry
        if (!data[monthYear]) {
            data[monthYear] = [];
        }
        const newData = { date: date.toISOString().split('T')[0], collections, rejects, deliveries, variance };
        data[monthYear].push(newData);
    }

    localStorage.setItem('data', JSON.stringify(data));

    renderData();
    document.getElementById('dataForm').reset();
});

function renderData() {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';

    for (const monthYear in data) {
        let monthSection = document.createElement('div');
        monthSection.id = monthYear;
        monthSection.innerHTML = `
            <div class="month-title">${monthYear}</div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Collections</th>
                            <th>Rejects</th>
                            <th>Deliveries</th>
                            <th>Variance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-${monthYear}">
                        <!-- Data rows will go here -->
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th id="totalCollections-${monthYear}">0.00</th>
                            <th id="totalRejects-${monthYear}">0.00</th>
                            <th id="totalDeliveries-${monthYear}">0.00</th>
                            <th id="totalVariance-${monthYear}">0.00</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
        tableContainer.appendChild(monthSection);

        const tableBody = document.getElementById(`tbody-${monthYear}`);

        let totalCollections = 0;
        let totalRejects = 0;
        let totalDeliveries = 0;
        let totalVariance = 0;

        data[monthYear].forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.collections.toFixed(2)}</td>
                <td>${entry.rejects.toFixed(2)}</td>
                <td>${entry.deliveries.toFixed(2)}</td>
                <td class="variance">${entry.variance.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" onclick="editEntry('${monthYear}', ${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteEntry('${monthYear}', ${index})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);

            totalCollections += entry.collections;
            totalRejects += entry.rejects;
            totalDeliveries += entry.deliveries;
            totalVariance += entry.variance;
        });

        document.getElementById(`totalCollections-${monthYear}`).textContent = totalCollections.toFixed(2);
        document.getElementById(`totalRejects-${monthYear}`).textContent = totalRejects.toFixed(2);
        document.getElementById(`totalDeliveries-${monthYear}`).textContent = totalDeliveries.toFixed(2);
        document.getElementById(`totalVariance-${monthYear}`).textContent = totalVariance.toFixed(2);
    }
}

function editEntry(monthYear, index) {
    let data = JSON.parse(localStorage.getItem('data')) || {};

    if (data[monthYear]) {
        const entry = data[monthYear][index];

        document.getElementById('date').value = entry.date;
        document.getElementById('collections').value = entry.collections.toFixed(2);
        document.getElementById('rejects').value = entry.rejects.toFixed(2);
        document.getElementById('deliveries').value = entry.deliveries.toFixed(2);

        editIndex = index;
        editMonthYear = monthYear;

        document.getElementById('submit-button').textContent = 'Update Entry';
    }
}

function deleteEntry(monthYear, index) {
    let data = JSON.parse(localStorage.getItem('data')) || {};

    if (data[monthYear]) {
        data[monthYear].splice(index, 1);

        if (data[monthYear].length === 0) {
            delete data[monthYear];
        }

        localStorage.setItem('data', JSON.stringify(data));
        renderData();
    }
}

document.addEventListener('DOMContentLoaded', renderData);
