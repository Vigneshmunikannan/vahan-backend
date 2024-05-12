const tokenBlacklist = new Set(); // Initialize a set to store revoked tokens

// Function to add a token to the blacklist
const expiresInHours = 1;
const expiresInMilliseconds = expiresInHours * 60 * 60 * 1000;

const addToBlacklist = (token, expiresIn) => {
    tokenBlacklist.add(token);

    // Automatically remove the token from the blacklist after it expires
    setTimeout(() => {
        removeFromBlacklist(token)
        console.log(`Token ${token} expired and removed from the blacklist`);
    }, expiresInMilliseconds); // Convert expiresIn to milliseconds
};

// Function to check if a token is blacklisted
const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};

// Function to remove a token from the blacklist
const removeFromBlacklist = (token) => {
    tokenBlacklist.delete(token);
    console.log(`Token ${token} removed from the blacklist`);
};

module.exports = { addToBlacklist, isTokenBlacklisted, removeFromBlacklist };
