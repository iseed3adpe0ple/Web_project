<h1 align="center">🚀 Web Dev Final Project</h1>
<p>Project: PlanSync </p>
<p>Team: DreamCoders 💻</p>
<hr>
<h2>👩‍💻 Team members: </h2>
<ul>
  <li>Muratkyzy Adina, 24B031066</li>
  <li>Bekishev Iskander, 24B031703</li>
  <li>Bedelov Deniyel, 24B031697</li>
</ul>
<hr>



<div align="center">
  <h1>🎯 PlanSync</h1>
  <h3>Shared Calendar for Teams & Friends</h3>
</div>

<hr>

<h2>👤 User Functionality</h2>

<h3>1. 🔐 Authentication & Personal Dashboard</h3>
<p>The personal dashboard is the main page after login. It displays:</p>
<ul>
  <li>📌 Personal upcoming events</li>
  <li>✉️ Invitations from teams</li>
  <li>🗳️ Active polls</li>
  <li>🔔 Recent notifications</li>
</ul>

<hr>

<h3>2. 👥 Team Creation</h3>
<p>Each user can create a team for planning meetings, study sessions, or group activities. A team can contain <strong>up to 4 members</strong>, including the creator.</p>
<p>The team creation form includes:</p>
<ul>
  <li>🏷️ Team name</li>
  <li>📝 Short description</li>
  <li>📧 Member invitations by email or username</li>
</ul>

<hr>

<h3>3. 🗳️ Poll Creation</h3>
<p>Inside a team, users can create polls to decide on a convenient date or time for a meeting. This makes the planning process easier and avoids long discussions in chats.</p>
<p>The poll creation form includes:</p>
<ul>
  <li>📋 Poll title</li>
  <li>📝 Description</li>
  <li>🕐 Several date and time options</li>
  <li>⏰ Deadline for voting</li>
</ul>

<hr>

<h3>4. 🔔 Notification After Voting Ends</h3>
<p>When the voting deadline is reached, the system sends a notification to all team members informing them that the poll is closed and showing the winning time slot.</p>
<p>Notifications include:</p>
<ul>
  <li>✅ Poll finished message</li>
  <li>📅 Selected meeting date and time</li>
  <li>👥 Team name</li>
  <li>🔗 Quick link to create or open the final event</li>
</ul>

<p>A full-stack web application for coordinating group events, scheduling polls, and managing invitations — built with <strong>Angular</strong> and <strong>Django REST Framework</strong>.</p>

<hr>

<h2>Features</h2>

<h3>Authentication</h3>
<ul>
  <li>JWT-based registration and login</li>
  <li>Access & refresh token flow with HTTP interceptor</li>
  <li>Protected routes with Angular route guards</li>
  <li>Auto-attach <code>Authorization: Bearer</code> header to all requests</li>
</ul>

<h3>📆 Personal Dashboard</h3>
<ul>
  <li>Monthly/weekly calendar with personal and group events</li>
  <li>Color-coded events by type: study, social, work</li>
  <li>Today indicator, prev/next navigation</li>
  <li>Quick actions: Create Event, My Groups, Invitations</li>
</ul>

<h3>👥 Groups</h3>
<ul>
  <li>Create and manage groups</li>
  <li>Join via group code or email invite</li>
  <li>Shared group calendar with event filtering</li>
  <li>Member list with roles (owner / member)</li>
</ul>

<h3>📋 Events</h3>
<ul>
  <li>Full event creation form: title, date/time, location, description, type, privacy</li>
  <li>Invite specific group members</li>
  <li>RSVP: Going / Not Going / Maybe</li>
  <li>Owner controls: Edit and Delete</li>
</ul>

<h3>🗳️ Poll System</h3>
<ul>
  <li>Create "When should we meet?" polls</li>
  <li>Add multiple time slot options</li>
  <li>Members vote 👍 / 👎 on each slot</li>
  <li>Convert winning slot to real event</li>
</ul>

<h3>📬 Invitations</h3>
<ul>
  <li>Dedicated page for all pending and responded invites</li>
  <li>Status badges: Pending / Going / Declined</li>
  <li>One-click Accept / Decline</li>
</ul>

<h3>👤 Profile</h3>
<ul>
  <li>View username, email, avatar</li>
  <li>Edit profile (name, avatar color)</li>
  <li>Active events list with cancel option</li>
  <li>Event history and group memberships</li>
</ul>

<hr>



<hr>

