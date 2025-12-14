document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading
    loading.style.display = 'block';
    result.style.display = 'none';
    submitBtn.disabled = true;

    // Prepare form data
    const formData = new FormData(e.target);

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Hide loading
        loading.style.display = 'none';
        submitBtn.disabled = false;

        if (data.success) {
            // Show result
            result.className = 'result ' + (data.prediction === 'Placed' ? 'placed' : 'not-placed');

            const icon = data.prediction === 'Placed' ? '✅' : '⚠️';

            result.innerHTML = `
                        <h2>${icon} ${data.prediction}!</h2>
                        <p>Hello, <strong>${data.name}</strong></p>
                        <div class="percentage">${data.placement_chance}%</div>
                        <p>Placement Probability</p>
                        <p style="margin-top: 20px; font-size: 0.95em; opacity: 0.8;">
                            Your data has been saved to the database for future training.
                        </p>
                    `;

            // Add strengths and improvements section
            if (data.analysis) {
                const analysisHTML = `
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; text-align: left;">
                                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border: 2px solid #4caf50;">
                                    <h3 style="color: #2e7d32; margin-bottom: 15px; display: flex; align-items: center;">
                                        <span style="font-size: 1.5em; margin-right: 10px;">💪</span> Strengths
                                    </h3>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        ${data.analysis.strengths.map(s => `<li style="padding: 8px 0; color: #1b5e20;">✓ ${s}</li>`).join('')}
                                    </ul>
                                </div>
                                <div style="background: #fff3e0; padding: 20px; border-radius: 10px; border: 2px solid #ff9800;">
                                    <h3 style="color: #e65100; margin-bottom: 15px; display: flex; align-items: center;">
                                        <span style="font-size: 1.5em; margin-right: 10px;">📈</span> Areas to Improve
                                    </h3>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        ${data.analysis.improvements.map(i => `<li style="padding: 8px 0; color: #bf360c;">→ ${i}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `;
                result.innerHTML += analysisHTML;
            }

            result.style.display = 'block';

            // Scroll to result
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert('Error: ' + data.error);
        }

    } catch (error) {
        loading.style.display = 'none';
        submitBtn.disabled = false;
        alert('An error occurred. Please try again.');
        console.error(error);
    }
});