document.addEventListener('DOMContentLoaded', function() {
    // Show/Hide fields based on contribution type
    document.getElementById('contributionType').addEventListener('change', function() {
        if (this.value === 'monthly') {
            document.getElementById('monthlySavingsGroup').style.display = 'block';
            document.getElementById('yearlySavingsGroup').style.display = 'none';
            document.getElementById('yearlySavings').required = false;
            document.getElementById('monthlySavings').required = true;
        } else {
            document.getElementById('monthlySavingsGroup').style.display = 'none';
            document.getElementById('yearlySavingsGroup').style.display = 'block';
            document.getElementById('monthlySavings').required = false;
            document.getElementById('yearlySavings').required = true;
        }
    });

    // Calculator form submission handling
    document.getElementById('calculator-form').addEventListener('submit', function(e) {
        e.preventDefault();

        console.log('Calculator form submitted.');

        const initialSavings = parseFloat(document.getElementById('initialSavings').value);
        const contributionType = document.getElementById('contributionType').value;
        const monthlySavings = contributionType === 'monthly' ? parseFloat(document.getElementById('monthlySavings').value) : 0;
        const yearlySavings = contributionType === 'yearly' ? parseFloat(document.getElementById('yearlySavings').value) : 0;
        const years = parseInt(document.getElementById('years').value);
        const dividendRate = parseFloat(document.getElementById('dividendRate').value) / 100;

        if (isNaN(initialSavings) || (contributionType === 'monthly' && isNaN(monthlySavings)) || (contributionType === 'yearly' && isNaN(yearlySavings)) || isNaN(years) || isNaN(dividendRate)) {
            alert('Please enter valid numbers');
            return;
        }

        let totalContributions = initialSavings;
        let totalDividends = 0;
        let balance = initialSavings;
        let breakdown = '';
        let breakdownData = [];

        for (let year = 1; year <= years; year++) {
            let yearlyContributions = contributionType === 'monthly' ? monthlySavings * 12 : yearlySavings;
            totalContributions += yearlyContributions;
            balance += yearlyContributions;

            let annualDividend = balance * dividendRate;
            totalDividends += annualDividend;
            balance += annualDividend; // Updating balance with this year's dividend

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

        let totalAmount = balance; // Total amount is now the balance after dividends compounded

        document.getElementById('result').innerHTML = `
            <h4>Results</h4>
            <p>Total Contributions: PHP ${totalContributions.toFixed(2)}</p>
            <p>Total Dividends: PHP ${totalDividends.toFixed(2)}</p>
            <p>Total Amount after ${years} years: PHP ${totalAmount.toFixed(2)}</p>
            <h4>Yearly Breakdown</h4>
            <div class="table-responsive">
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
            </div>
        `;

        // Add download functionality
        document.getElementById('downloadExcel').addEventListener('click', function() {
            downloadExcel(breakdownData);
        });

        document.getElementById('downloadPDF').addEventListener('click', function() {
            downloadPDF(breakdownData);
        });
    });

    // Feedback form submission handling
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the normal form submission
        
        emailjs.sendForm('service_ji5hkp9', 'template_7qu68we', this)
            .then(function(response) {
               console.log('SUCCESS!', response.status, response.text);
               alert('Feedback sent successfully!');
               document.getElementById('feedback').value = ''; // Clear the textarea after sending feedback
               document.getElementById('email').value = ''; // Clear the email field
               document.getElementById('marketingConsent').checked = false; // Reset the checkbox
            }, function(error) {
               console.log('FAILED...', error);
               alert('Failed to send feedback. Error: ' + error.text);
            });
    });
});

function downloadExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MP2 Savings Breakdown');
    XLSX.writeFile(workbook, 'MP2_Savings_Breakdown.xlsx');
}

function downloadPDF(data) {
    const doc = new jsPDF();
    doc.autoTable({
        head: [['Year', 'Yearly Contributions', 'Yearly Dividends', 'Total Earned', 'Balance at Year End']],
        body: data.map(item => [item.Year, item['Yearly Contributions'], item['Yearly Dividends'], item['Total Earned'], item['Balance at Year End']])
    });
    doc.save('MP2_Savings_Breakdown.pdf');
}
