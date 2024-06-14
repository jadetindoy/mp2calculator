document.addEventListener('DOMContentLoaded', function() {
    // Calculator form submission handling
    document.getElementById('calculator-form').addEventListener('submit', function(e) {
        e.preventDefault();

        console.log('Calculator form submitted.');

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
            let yearlyContributions = monthlySavings * 12;
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
