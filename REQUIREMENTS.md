# Listwise — Requirements & Vision

## Original Prompt (Jacob, 2026-02-08)

> I want an AI assistant with a file system that can expose publicly, and ideally give other people sharing permissions to edit or contribute to any one of the files.
>
> I primarily want to use it to quickly make and share lists, like lists of cool events in San Francisco, great body workers, etc. And in the future, ideally, I'd like it to have a nice interface where people can manually edit these lists as well, even on mobile. Probably it would be nice if they're good-looking markdown.
>
> I'm going to really care about having this AI assistant have a voice mode because that's how I'm going to want to talk to it a lot, as well as a chat mode. I'm thinking it should probably have Claude Code under the hood, on dangerously skip permissions, instead of just a plain old AI API, because then it can do more agentic stuff — like spawn a bash shell and search the web.

## Core Vision

An AI assistant that manages a public file system of curated lists. Users interact via chat (and eventually voice) to create, edit, and share lists. The assistant uses a coding agent (Claude Code) under the hood for agentic capabilities.

## Feature Requirements

### List Management
- Lists stored as markdown files with YAML frontmatter
- Three visibility levels: **public** (discoverable), **unlisted** (link-only), **private** (owner-only)
- Beautiful markdown rendering (headings, blockquotes, links, sections, GFM)
- Manual editing interface with live preview
- Mobile-friendly editing

### Permissions & Collaboration
- Owner has full control (read, edit, delete, change permissions)
- Collaborator/editor access — owner can grant edit permission to specific users
- AI assistant can programmatically add to lists the user doesn't own (if they have edit access)
- Anonymous list creation with edit tokens
- Multiple permission variants (view-only, suggest, edit, admin)

### AI Assistant (ChatGPT-style Interface)
- Chat interface — feels like ChatGPT, not a dev tool
- Sidebar showing the file system of lists created/contributed to
- Uses a coding agent (Claude Code in print mode) under the hood
- Runs with dangerously skip permissions — no approval prompts
- Can create, edit, search, and manage lists conversationally
- Can research and generate list content (web search, etc.)
- Can add to lists that aren't yours (if you have permissions)
- Same interface can pop open as a sidebar on the existing list browsing app
- Look at Claude Code UI repo for inspiration on wrapping Claude Code into a chat interface

### Voice Mode (Future — Jacob building separately)
- Voice input as primary interaction mode
- Will be integrated later as a separate effort

### Auth & Users
- Username/password signup
- Sample accounts with quick-login buttons
- JWT-based auth (no database, flat file user store)
- User profiles showing their public lists

### Infrastructure
- Deploy to Lightsail (Ubuntu 24.04, 3.216.129.34)
- Node.js + Express backend, React + Vite frontend, TypeScript
- Markdown files on disk (no database)
- pm2 process management, nginx reverse proxy

## What's Built (as of 2026-02-09)
- Full CRUD for lists (create, read, update, delete)
- Markdown rendering with react-markdown
- Browse/explore with category filtering and search
- Auth (signup, login, sample accounts)
- Editor with live preview
- Anonymous list creation
- Deployed and running on Lightsail at http://3.216.129.34

## What's NOT Built Yet
- [ ] Proper private list access control (GET endpoint doesn't check auth)
- [ ] Owner can see own private lists on profile
- [ ] AI chat interface
- [ ] Coding agent integration (Claude Code)
- [ ] File system sidebar in chat interface
- [ ] Collaboration/sharing permissions
- [ ] Permission variants (view, suggest, edit, admin)
- [ ] Voice mode (Jacob building separately)
- [ ] SSL/HTTPS
- [ ] Anonymous list edit button in UI
