document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();

    // Handle Project Submission
    document.getElementById('project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('p-title').value,
            event_name: document.getElementById('p-event').value,
            leader_name: document.getElementById('p-leader').value,
            required_skills: document.getElementById('p-skills').value,
            description: document.getElementById('p-desc').value
        };

        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Project published successfully!');
            document.getElementById('project-form').reset();
            fetchProjects();
        }
    });

    // Handle User Profile Submission
    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('u-name').value,
            skills: document.getElementById('u-skills').value,
            bio: document.getElementById('u-bio').value
        };

        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Profile saved successfully!');
            document.getElementById('user-form').reset();
        }
    });
});

async function fetchProjects() {
    try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        const container = document.getElementById('projects-container');
        container.innerHTML = '';

        if (projects.length === 0) {
            container.innerHTML = '<p>No active projects posted yet. Be the first!</p>';
            return;
        }

        projects.forEach(p => {
            const skillsHTML = p.required_skills.split(',').map(s => `<span class="badge">${s.trim()}</span>`).join('');
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="event">${p.event_name}</div>
                <h3>${p.title}</h3>
                <p><strong>Lead:</strong> ${p.leader_name}</p>
                <p>${p.description}</p>
                <div style="margin-bottom: 1rem;">${skillsHTML}</div>
                <button class="btn secondary" onclick="alert('Connection request sent to ${p.leader_name}!')">Join Team</button>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load projects', err);
    }
}
