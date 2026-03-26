/* script.js */
const initialInput = document.getElementById('initial-investment');
const finalInput = document.getElementById('final-value');
const yearsInput = document.getElementById('investment-years');
const calcBtn = document.getElementById('calc-btn');

const resultRoi = document.getElementById('result-roi');
const resultAnnualRoi = document.getElementById('result-annual-roi');
const resultGain = document.getElementById('result-gain');
const resultTotal = document.getElementById('result-total');

// Number formatter for USD output
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function calculateROI() {
    const initial = parseFloat(initialInput.value);
    const final = parseFloat(finalInput.value);
    
    // Default to 1 year if blank, allowing calculation to complete sensibly
    let years = parseFloat(yearsInput.value);
    if (isNaN(years) || years <= 0) {
        years = 1; 
    }

    if (isNaN(initial) || isNaN(final)) {
        alert("Please enter valid initial investment and amount returned.");
        return;
    }

    if (initial === 0) {
        alert("Initial investment cannot be equal to zero for ROI calculation.");
        return;
    }

    // Calculations
    const gain = final - initial;
    const roi = (gain / initial) * 100;
    
    // Annualized ROI computation using standard generic formula: [(Final/Initial)^(1/Years)] - 1
    // Exception for negative values causing imaginary roots, if final is negative it doesn't make geometric sense,
    // but typically final is a positive balance.
    let annualRoi = 0;
    if (final > 0 && initial > 0 && years > 0) {
        annualRoi = (Math.pow((final / initial), (1 / years)) - 1) * 100;
    } else {
        annualRoi = roi; // Fallback or linear average if geometric doesn't cleanly apply
    }

    // Update UI Elements
    resultRoi.textContent = `${roi.toFixed(2)}%`;
    resultAnnualRoi.textContent = `${annualRoi.toFixed(2)}%`;
    
    resultGain.textContent = currencyFormatter.format(gain);
    // Assign color classes based on positive or negative return
    if (gain > 0) {
        resultGain.className = "positive";
        resultRoi.style.color = "#00e676"; // Also tint the main ROI text if requested
        resultRoi.style.background = "none";
        resultRoi.style.webkitTextFillColor = "#00e676";
    } else if (gain < 0) {
        resultGain.className = "negative";
        resultRoi.style.color = "#ff4757";
        resultRoi.style.background = "none";
        resultRoi.style.webkitTextFillColor = "#ff4757";
    } else {
        resultGain.className = "";
        resultRoi.style.color = "#ffffff";
        resultRoi.style.background = "none";
        resultRoi.style.webkitTextFillColor = "#ffffff";
    }

    resultTotal.textContent = currencyFormatter.format(final);
}

// Attach Event Listeners
calcBtn.addEventListener('click', calculateROI);

// Allow checking via 'Enter' key inside any input field
[initialInput, finalInput, yearsInput].forEach(field => {
    field.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateROI();
    });
});
