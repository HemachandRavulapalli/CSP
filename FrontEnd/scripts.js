// 1. **Login Form Submission**
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Store the authentication token in localStorage/sessionStorage
            if (rememberMe) {
                localStorage.setItem('authToken', result.token);
            } else {
                sessionStorage.setItem('authToken', result.token);
            }

            // Redirect to a protected page
            window.location.href = 'marketplace.html';  // Replace with the appropriate page
        } else {
            alert(result.message); // Show error message if login fails
        }
    } catch (error) {
        alert('Error logging in. Please try again later.');
    }
});
// Fetch marketplace data (crops)
const response = await fetch('http://localhost:3000/api/marketplace');
const data = await response.json();

// 2. **User Authentication Check (for protected pages)**
window.onload = function() {
    if (localStorage.getItem('authToken') || sessionStorage.getItem('authToken')) {
        // If token is found, the user is logged in, show protected content
        document.getElementById('protected-links').style.display = 'block';
        document.getElementById('login-form').style.display = 'none';
    }
};

// 3. **OTP Sending (For Registration)**
document.getElementById('send-otp').addEventListener('click', async () => {
    const phone = document.getElementById('phone').value;

    try {
        const response = await fetch('http://localhost:3000/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('OTP sent successfully!');
            document.getElementById('otp-section').style.display = 'block';  // Show OTP input
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error sending OTP. Please try again later.');
    }
});

// 4. **Registration Form Submission**
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const otp = document.getElementById('otp').value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, password, otp }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'index.html';  // Redirect to login page after successful registration
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error registering user. Please try again later.');
    }
});

// 5. **Marketplace Data Fetching (Example of an API call)**
async function fetchMarketplaceData() {
    try {
        const response = await fetch('http://localhost:3000/api/marketplace');
        const result = await response.json();

        // Render marketplace data on the page
        const marketplaceContainer = document.getElementById('marketplace-container');
        marketplaceContainer.innerHTML = result.marketplace.map(item => `
            <div class="marketplace-item">
                <h3>${item.crop}</h3>
                <p>Seller: ${item.seller}</p>
                <p>Price: ${item.price}</p>
                <p>Location: ${item.location}</p>
            </div>
        `).join('');
    } catch (error) {
        alert('Error fetching marketplace data. Please try again later.');
    }
}

// 6. **Fetch Crop Recommendations (For Recommendations Page)**
async function fetchCropRecommendations() {
    try {
        const soilType = 'clay';  // Example of user-selected data
        const weather = 'sunny';  // Example of user-selected data
        const marketDemand = 'corn';  // Example of user-selected data

        const response = await fetch(`http://localhost:3000/api/recommendations?soilType=${soilType}&weather=${weather}&marketDemand=${marketDemand}`);
        const result = await response.json();

        const recommendationsContainer = document.getElementById('recommendations-container');
        recommendationsContainer.innerHTML = result.recommendations.map(recommendation => `
            <div class="recommendation-item">
                <h3>${recommendation.crop}</h3>
                <p>${recommendation.description}</p>
                <p>Watering: ${recommendation.watering}</p>
                <p>Fertilizer: ${recommendation.fertilizer}</p>
            </div>
        `).join('');
    } catch (error) {
        alert('Error fetching recommendations. Please try again later.');
    }
}

// 7. **Weather Data Fetching (For Recommendations or Daily Care Page)**
async function fetchWeatherData() {
    try {
        const location = 'New York';  // Example location
        const response = await fetch(`http://localhost:3000/api/weather?location=${location}`);
        const result = await response.json();

        // Display weather data on the page
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = `
            <h3>Weather in ${result.location}</h3>
            <p>Temperature: ${result.weather.temperature}</p>
            <p>Humidity: ${result.weather.humidity}</p>
            <p>Forecast: ${result.weather.forecast}</p>
        `;
    } catch (error) {
        alert('Error fetching weather data. Please try again later.');
    }
}

// Call API functions to fetch data when the page loads (e.g., on Recommendations page)
window.onload = function() {
    fetchMarketplaceData();  // Fetch marketplace data
    fetchCropRecommendations();  // Fetch crop recommendations
    fetchWeatherData();  // Fetch weather data
};
