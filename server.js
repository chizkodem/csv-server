const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

// Define the path to your CSV file
const csvFilePath = './history.csv';

// Create the Express app
const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Function to edit the CSV file
function editCsv(unitNo, lastKnownLocation, dateTime, status) {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) throw err;

        // Split the CSV data into lines
        let lines = data.trim().split('\n');
        
        // Extract headers and rows
        let headers = lines[0].split(',');
        let rows = lines.slice(1);

        // Always add a new row
        rows.push([unitNo, lastKnownLocation, dateTime, status].join(','));

        // Combine headers and updated rows back into a single string
        const updatedCsv = [headers.join(','), ...rows].join('\n');

        // Write the updated CSV back to the file
        fs.writeFile(csvFilePath, updatedCsv, (err) => {
            if (err) throw err;
            console.log('CSV file has been updated with a new entry.');
        });
    });
}

console.log("IM GAY")



// Route to edit CSV data
app.put("/editCsv", (req, res) => {
    const { unitNo, lastKnownLocation, dateTime, status } = req.body;

    // Validate input
    if (!unitNo || !lastKnownLocation || !dateTime || !status) {
        return res.status(400).send("All fields are required.");
    }

    editCsv(unitNo, lastKnownLocation, dateTime, status);
    res.status(200).send("CSV editing function called.");
});

// Start the server
const PORT = process.env.PORT || 1314;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
