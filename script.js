const searchInput = document.getElementById('search');
const suggestionsList = document.getElementById('suggestions');
const resultsDiv = document.getElementById('results');

searchInput.addEventListener('input', async () => {
    const query = searchInput.value;

    // Clear previous suggestions and results
    suggestionsList.innerHTML = '';
    resultsDiv.innerHTML = '';

    if (query.length < 3) return;

    // Fetch suggestions from GitHub API
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    const data = await response.json();

    // Display suggestions
    data.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.full_name;
        li.onclick = () => displayRepoDetails(item);
        suggestionsList.appendChild(li);
    });
});

async function displayRepoDetails(repo) {
    resultsDiv.innerHTML = `
        <h2>${repo.full_name}</h2>
        <p><strong>Description:</strong> ${repo.description || 'No description available.'}</p>
        <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
        <p><strong>Forks:</strong> ${repo.forks_count}</p>
        <p><strong>Language:</strong> ${repo.language}</p>
        <p><strong>Created At:</strong> ${new Date(repo.created_at).toLocaleDateString()}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;

    // Fetch additional information (profile views, total repos, etc.)
    const userResponse = await fetch(repo.owner.url);
    const userData = await userResponse.json();

    resultsDiv.innerHTML += `
        <h3>Owner Info</h3>
        <p><strong>Username:</strong> ${userData.login}</p>
        <p><strong>Total Repositories:</strong> ${userData.public_repos}</p>
        <p><strong>Followers:</strong> ${userData.followers}</p>
        <p><strong>Profile Views:</strong> Not directly available via API</p>
        <a href="${userData.html_url}" target="_blank">View Profile</a>
    `;
    suggestionsList.innerHTML = ''; // Clear suggestions after selection
}
