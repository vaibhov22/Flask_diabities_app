// JavaScript to handle form submission and API call
const form = document.getElementById('prediction-form');
const resultContainer = document.getElementById('result-container');
const predictBtn = document.getElementById('predictBtn');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Show loading state
    predictBtn.disabled = true;
    predictBtn.innerText = 'Analyzing...';
    resultContainer.innerHTML = '';

    // 2. Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        // Convert values to numbers
        data[key] = parseFloat(value);
    });

    // 3. Send data to Flask backend using Fetch API
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
    if (result.error) {
        // Show backend error message
        resultContainer.innerHTML = `<p style="color:red;">Error: ${result.error}</p>`;
    } else {
        displayResult(result.prediction);
    }
     })

    .catch(error => {
        // 5. Handle errors
        console.error('Error:', error);
        displayResult('error');
    })
    .finally(() => {
        // 6. Reset button state
        predictBtn.disabled = false;
        predictBtn.innerText = 'Get Prediction';
    });
});

function displayResult(prediction) {
    let resultHTML = '';
    let resultClass = '';
    let resultText = '';
    let icon = '';

    if (prediction === 1) {
        resultClass = 'positive';
        resultText = '<strong>Result:</strong> Positive for Diabetes';
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (prediction === 0) {
        resultClass = 'negative';
        resultText = '<strong>Result:</strong> Negative for Diabetes';
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
         resultClass = 'positive'; // Use error styling for error message
         resultText = 'An error occurred. Please try again.';
         icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }
    
    resultHTML = `<div class="prediction-result ${resultClass}">${icon}<div>${resultText}</div></div>`;
    resultContainer.innerHTML = resultHTML;
    
    // Add 'visible' class after a short delay to trigger the transition
    setTimeout(() => {
        const resultDiv = document.querySelector('.prediction-result');
        if (resultDiv) {
            resultDiv.classList.add('visible');
        }
    }, 10);
}
