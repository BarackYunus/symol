export default async function checkUsernameAvailability(username) {
    // Simulating a database request (Replace with actual API call)
    const takenUsernames = ["john_doe", "oswan", "testuser"]; // Example taken usernames
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

    return !takenUsernames.includes(username.toLowerCase());
}

export function addUsernameListener() {
    const input = document.getElementById("usernameInput");

    if (!input) return;

    input.addEventListener("input", async (event) => {
        const username = event.target.value.trim();

        if (!username) {
            input.style.color = "black";
            return;
        }

        const available = await checkUsernameAvailability(username);

        if (!available) {
            input.classList.add("shake");
            setTimeout(() => {
                input.classList.remove("shake");
                input.value = ""; // Clear input
            }, 500);
        } else {
            input.style.color = "blue"; // Change text color to blue
        }
    });
}
