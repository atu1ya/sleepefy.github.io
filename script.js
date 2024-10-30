document.getElementById('caffeine-yes').addEventListener('click', function() {
    document.getElementById('caffeine-details').style.display = 'block';
    document.getElementById('caffeine-section').style.display = 'none';
});

document.getElementById('caffeine-no').addEventListener('click', function() {
    document.getElementById('bedtime-form').style.display = 'block';
    document.getElementById('wakeuptime-form').style.display = 'block';
    document.getElementById('caffeine-section').style.display = 'none';
});

document.getElementById('caffeine-quick').addEventListener('click', function() {
    document.getElementById('caffeine-quick-form').style.display = 'block';
    document.getElementById('caffeine-details').style.display = 'none';
});

document.getElementById('caffeine-detailed').addEventListener('click', function() {
    document.getElementById('caffeine-detailed-form').style.display = 'block';
    document.getElementById('caffeine-details').style.display = 'none';
});

document.getElementById('quick-caffeine-today').addEventListener('input', function() {
    updateCaffeineDisplay('quick-caffeine-today', 'caffeine-today-display');
});

document.getElementById('detailed-caffeine-today').addEventListener('input', function() {
    updateCaffeineDisplay('detailed-caffeine-today', 'detailed-caffeine-today-display');
});

document.getElementById('caffeine-quick-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const avgCaffeineIntake = document.getElementById('quick-caffeine-intake').value;
    const hoursSinceCaffeine = document.getElementById('quick-hours-since-caffeine').value;
    const caffeineToday = document.getElementById('quick-caffeine-today').value;
    const estimatedSleepOnset = calculateSleepOnsetTime(175, 68, avgCaffeineIntake, hoursSinceCaffeine, caffeineToday);
    document.getElementById('bedtime-form').style.display = 'block';
    document.getElementById('wakeuptime-form').style.display = 'block';
    document.getElementById('info').innerHTML += `<p>Estimated time to fall asleep: ${estimatedSleepOnset.toFixed(2)} minutes</p>`;
});

document.getElementById('caffeine-detailed-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const avgCaffeineIntake = document.getElementById('detailed-caffeine-intake').value;
    const hoursSinceCaffeine = document.getElementById('detailed-hours-since-caffeine').value;
    const caffeineToday = document.getElementById('detailed-caffeine-today').value;
    const estimatedSleepOnset = calculateSleepOnsetTime(height, weight, avgCaffeineIntake, hoursSinceCaffeine, caffeineToday);
    document.getElementById('bedtime-form').style.display = 'block';
    document.getElementById('wakeuptime-form').style.display = 'block';
    document.getElementById('info').innerHTML += `<p>Estimated time to fall asleep: ${estimatedSleepOnset.toFixed(2)} minutes</p>`;
});

document.getElementById('bedtime-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const bedtime = document.getElementById('bedtime').value;
    if (bedtime) {
        const results = calculateAlarmTimes(bedtime);
        displayResults(results, 'Recommended Alarm Times:');
    }
});

document.getElementById('wakeuptime-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const wakeuptime = document.getElementById('wakeuptime').value;
    if (wakeuptime) {
        const results = calculateBedtimes(wakeuptime);
        displayResults(results, 'Recommended Bedtimes:');
    }
});

function updateCaffeineDisplay(sliderId, displayId) {
    const caffeineToday = document.getElementById(sliderId).value;
    const cupsOfCoffee = (caffeineToday / 95).toFixed(1); // Average cup of coffee has 95 mg of caffeine
    const cansOfRedBull = (caffeineToday / 111).toFixed(1); // 375mL can of Red Bull has 111 mg of caffeine
    document.getElementById(displayId).textContent = `${caffeineToday} mg (${cupsOfCoffee} cups of coffee / ${cansOfRedBull} cans of Red Bull)`;
}

function calculateSleepOnsetTime(height, weight, avgCaffeineIntake, hoursSinceCaffeine, caffeineToday) {
    const caffeineHalfLife = 5; // in hours
    const caffeineSensitivityFactor = 0.5; // Sensitivity multiplier (adjusted to reduce sleep onset time impact)
    
    // Calculate remaining caffeine in the body
    const remainingCaffeine = (caffeineToday + avgCaffeineIntake) * (0.5 ** (hoursSinceCaffeine / caffeineHalfLife));

    // Adjust sensitivity: Higher weight reduces caffeine impact slightly, height increases it
    const sensitivity = (weight / height) * caffeineSensitivityFactor;

    // Calculate sleep onset time based on caffeine impact, with reduced influence
    const caffeineImpact = (remainingCaffeine / sensitivity) * 0.2 / 1000; // Scaled down by 0.2 and divided by 1000 to reduce excessive impact
    const estimatedSleepOnset = caffeineImpact;

    return estimatedSleepOnset;
}

function calculateAlarmTimes(bedtime) {
    const sleepCycleMinutes = 100;
    const fallAsleepMinutes = 17;
    const bedtimeDate = new Date(`1970-01-01T${bedtime}:00`);
    const results = [];

    for (let i = 1; i <= 9; i++) {
        const alarmTime = new Date(bedtimeDate.getTime() + (fallAsleepMinutes + i * sleepCycleMinutes) * 60000);
        results.push(alarmTime.toTimeString().substring(0, 5));
    }

    return results;
}

function calculateBedtimes(wakeuptime) {
    const sleepCycleMinutes = 100;
    const fallAsleepMinutes = 17;
    const wakeupDate = new Date(`1970-01-01T${wakeuptime}:00`);
    const results = [];

    for (let i = 9; i >= 1; i--) {
        const bedtime = new Date(wakeupDate.getTime() - (fallAsleepMinutes + i * sleepCycleMinutes) * 60000);
        results.push(bedtime.toTimeString().substring(0, 5));
    }

    return results;
}

function displayResults(results, title) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2>${title}</h2>`;
    results.forEach(time => {
        const timeElement = document.createElement('p');
        timeElement.textContent = time;
        resultsDiv.appendChild(timeElement);
    });
}