import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your Supabase project details
const supabaseUrl = 'https://escyylkafiltunujfiyu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEYeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzY3l5bGthZmlsdHVudWpmaXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzY0NzAsImV4cCI6MjA1NjgxMjQ3MH0.NGDwvH1tYB4rYaO2_ktEK9T_Gt08EKHSZzx7fzuiQbQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch data from Supabase
async function fetchData() {
    let { data, error } = await supabase
        .from('sensor_data') // Replace with your actual table name
        .select('device_id, voltage, current, power, fuel_level, humidity, temperature')
        .order('device_id', { ascending: true });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through data and add to table
    data.forEach(row => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.device_id}</td>
            <td>${row.voltage}</td>
            <td>${row.current}</td>
            <td>${row.power}</td>
            <td>${row.fuel_level}</td>
            <td>${row.humidity}</td>
            <td>${row.temperature}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Fetch data when page loads
fetchData();

// Real-time listener for database changes
supabase
    .channel('realtime:sensor_data')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sensor_data' }, payload => {
        console.log('Change received!', payload);
        fetchData(); // Re-fetch the updated data
    })
    .subscribe();
