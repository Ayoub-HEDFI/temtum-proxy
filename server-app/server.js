const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs'); // Still required for checking the script existence
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/create-user', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).send('Username is required');
    }

    const scriptPath = '/home/ubuntu/users_gen.sh'; // Ensure this path is correct

    // Check if the script file exists
    if (!fs.existsSync(scriptPath)) {
        return res.status(404).send('Script file not found');
    }

    // Define the directory and file path for the output
    const outputDir = './users-keys';
    const outputFile = `${outputDir}/${username}_private_key`;

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Update the command to redirect output to a file
    const command = `sudo ${scriptPath} ${username} > ${outputFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Server error: ${error.message}`);
        }

        if (stderr) {
            console.error(`script error: ${stderr}`);
            return res.status(500).send(`Script error: ${stderr}`);
        }

        // Assuming the script executes successfully and the output is written to the file
        res.send({ message: 'User created successfully', privateKeyFilePath: outputFile });
    });
});

// Add a new GET route for downloading a user's key file
app.get('/download-key/:username', (req, res) => {
    const { username } = req.params; // Extract the username from URL parameters

    // Define the directory and file path for the output based on the username
    const outputDir = './users-keys';
    const keyFilePath = path.join(outputDir, `${username}_private_key`);

    // Check if the key file exists for the given username
    if (fs.existsSync(keyFilePath)) {
        // Set headers to prompt download on the client side
        res.download(keyFilePath, (err) => {
            if (err) {
                console.error(`Download error: ${err}`);
                // Handle errors, but don't send error details to clients
                return res.status(500).send('Error downloading the file');
            }
            // No need to send a response; res.download handles it
        });
    } else {
        // If the key file does not exist, send a 404 Not Found response
        res.status(404).send('Key file not found');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
