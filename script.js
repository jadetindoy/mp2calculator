document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const initialSavings = parseFloat(document.getElementById('initialSavings').value);
    const monthlySavings = parseFloat(document.getElementById('monthlySavings').value);
    const years = parseInt(document.getElementById('years').value);
    const dividendRate = parseFloat(document.getElementById('dividendRate').value) / 100;

    if (isNaN(initialSavings) || isNaN(monthlySavings) || isNaN(years) || isNaN(dividendRate)) {
        alert('Please enter valid numbers');
        return;
    }

    let totalContributions = initialSavings;
    let totalDividends = 0;
    let balance = initialSavings;
    let breakdown = '';
    let breakdownData = [];

    for (let year = 1; year <= years; year++) {
        let yearlyContributions = 0;
        for (let month = 1; month <= 12; month++) {
            balance += monthlySavings;
            yearlyContributions += monthlySavings;
            totalContributions += monthlySavings;
        }
        let averageBalance = (balance - yearlyContributions + balance) / 2;
        let annualDividend = averageBalance * dividendRate;
        balance += annualDividend;
        totalDividends += annualDividend;

        breakdown += `
            <tr>
                <td>${year}</td>
                <td>PHP ${yearlyContributions.toFixed(2)}</td>
                <td>PHP ${annualDividend.toFixed(2)}</td>
                <td>PHP ${(yearlyContributions + annualDividend).toFixed(2)}</td>
                <td>PHP ${balance.toFixed(2)}</td>
            </tr>
        `;

        breakdownData.push({
            Year: year,
            'Yearly Contributions': yearlyContributions.toFixed(2),
            'Yearly Dividends': annualDividend.toFixed(2),
            'Total Earned': (yearlyContributions + annualDividend).toFixed(2),
            'Balance at Year End': balance.toFixed(2)
        });
    }

    let totalAmount = totalContributions + totalDividends;

    document.getElementById('result').innerHTML = `
        <h4>Results</h4>
        <p>Total Contributions: PHP ${totalContributions.toFixed(2)}</p>
        <p>Total Dividends: PHP ${totalDividends.toFixed(2)}</p>
        <p>Total Amount after ${years} years: PHP ${totalAmount.toFixed(2)}</p>
        <h4>Yearly Breakdown</h4>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Yearly Contributions</th>
                    <th>Yearly Dividends</th>
                    <th>Total Earned (Contributions + Dividends)</th>
                    <th>Balance at Year End</th>
                </tr>
            </thead>
            <tbody>
                ${breakdown}
            </tbody>
        </table>
    `;

    // Add download functionality
    document.getElementById('downloadExcel').addEventListener('click', function() {
        downloadExcel(breakdownData);
    });

    document.getElementById('downloadPDF').addEventListener('click', function() {
        downloadPDF(breakdownData);
    });
});

function downloadExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MP2 Savings Breakdown');
    XLSX.writeFile(workbook, 'MP2_Savings_Breakdown.xlsx');
}

function downloadPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('MP2 Savings Breakdown', 14, 16);
    const headers = [["Year", "Yearly Contributions", "Yearly Dividends", "Total Earned", "Balance at Year End"]];

    const rows = data.map(item => [
        item.Year,
        item['Yearly Contributions'],
        item['Yearly Dividends'],
        item['Total Earned'],
        item['Balance at Year End']
    ]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 20,
        theme: 'striped'
    });

    doc.save('MP2_Savings_Breakdown.pdf');
}
