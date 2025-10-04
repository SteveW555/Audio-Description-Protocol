# MCP Setup Guide for Claude Code on macOS

## Understanding the MCP Ecosystem

### Three Different Systems

**1\. Claude Desktop (Anthropic Chat Interface)**

- Config location: `~/Library/Application Support/Claude/claude_desktop_config.json`  
- Web-based chat interface with MCP support  
- Master configuration source

**2\. Claude Code (Anthropic Coding Tool)**

- Config location: `.claude/settings.local.json` (in project root)  
- CLI tool: `claude mcp` commands  
- VS Code extension that integrates with Claude  
- **Use this for coding with MCP**

**3\. VS Code GitHub Copilot (Microsoft's AI)**

- Config location: `.mcp.json` (in project root)  
- Separate system from Claude  
- MCP support is incomplete/different  
- **Don't use this for MCP** \- use Claude Code instead

---

## Configuration File Locations

| Tool | Config File | Scope |
| :---- | :---- | :---- |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | Global |
| Claude Code | `.claude/settings.local.json` | Project |
| VS Code Copilot | `.mcp.json` | Project |

---

## Clean Slate Setup

### Complete Reset (if needed)

\# Remove Claude Desktop config

rm \~/Library/Application\\ Support/Claude/claude\_desktop\_config.json

\# Clear logs

rm \~/Library/Logs/Claude/mcp\*.log

\# Clear npm cache

npm cache clean \--force

---

## Setting Up Claude Desktop (Master Config)

### Configuration Format

{

  "mcpServers": {

    "server-name": {

      "command": "npx",

      "args": \["-y", "package-name"\],

      "env": {

        "API\_KEY": "your-key-here"

      }

    }

  }

}

### Complete Example Configuration

cat \> \~/Library/Application\\ Support/Claude/claude\_desktop\_config.json \<\< 'EOF'

{

  "mcpServers": {

    "filesystem": {

      "command": "npx",

      "args": \[

        "-y",

        "@modelcontextprotocol/server-filesystem",

        "/Users/YOUR\_USERNAME"

      \]

    },

    "context7": {

      "command": "npx",

      "args": \[

        "-y",

        "@upstash/context7-mcp"

      \]

    },

    "firecrawl": {

      "command": "npx",

      "args": \[

        "-y",

        "firecrawl-mcp"

      \],

      "env": {

        "FIRECRAWL\_API\_KEY": "fc-YOUR\_KEY"

      }

    },

    "supabase": {

      "command": "npx",

      "args": \[

        "-y",

        "@supabase/mcp-server-supabase@latest",

        "--project-ref=YOUR\_PROJECT\_REF"

      \],

      "env": {

        "SUPABASE\_ACCESS\_TOKEN": "sbp\_YOUR\_TOKEN"

      }

    },

    "railway": {

      "command": "npx",

      "args": \[

        "-y",

        "@railway/mcp-server"

      \]

    },

    "github": {

      "command": "npx",

      "args": \[

        "-y",

        "@modelcontextprotocol/server-github"

      \],

      "env": {

        "GITHUB\_PERSONAL\_ACCESS\_TOKEN": "ghp\_YOUR\_TOKEN"

      }

    }

  }

}

EOF

After creating/updating: **Restart Claude Desktop** (Cmd+Q, then reopen)

---

## Individual MCP Server Setup

### 1\. Filesystem

"filesystem": {

  "command": "npx",

  "args": \["-y", "@modelcontextprotocol/server-filesystem", "/Users/YOUR\_USERNAME"\]

}

- **Purpose**: Access local files  
- **No API key required**

### 2\. Context7

"context7": {

  "command": "npx",

  "args": \["-y", "@upstash/context7-mcp"\]

}

- **Purpose**: Fetch up-to-date library documentation  
- **No API key required**  
- **Usage in Claude**: Add "use context7" to prompts

### 3\. Firecrawl

"firecrawl": {

  "command": "npx",

  "args": \["-y", "firecrawl-mcp"\],

  "env": {

    "FIRECRAWL\_API\_KEY": "fc-YOUR\_KEY"

  }

}

- **Purpose**: Web scraping and crawling  
- **Setup**: Get API key from [https://firecrawl.dev/app/api-keys](https://firecrawl.dev/app/api-keys)

### 4\. Supabase

"supabase": {

  "command": "npx",

  "args": \[

    "-y",

    "@supabase/mcp-server-supabase@latest",

    "--project-ref=YOUR\_PROJECT\_REF"

  \],

  "env": {

    "SUPABASE\_ACCESS\_TOKEN": "sbp\_YOUR\_TOKEN"

  }

}

- **Purpose**: Database access and management  
- **Setup**:  
  - Get token: [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)  
  - Project ref from project URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`  
- **For read-only**: Add `"--read-only"` to args array

### 5\. Railway

"railway": {

  "command": "npx",

  "args": \["-y", "@railway/mcp-server"\]

}

- **Purpose**: Deploy and manage Railway applications  
- **Prerequisites**:  
    
  \# Install CLI  
    
  brew install railway  
    
  \# OR  
    
  npm install \-g @railway/cli  
    
  \# Login  
    
  railway login  
    
  \# Verify  
    
  railway whoami

### 6\. GitHub

"github": {

  "command": "npx",

  "args": \["-y", "@modelcontextprotocol/server-github"\],

  "env": {

    "GITHUB\_PERSONAL\_ACCESS\_TOKEN": "ghp\_YOUR\_TOKEN"

  }

}

- **Purpose**: Repository management  
- **Setup**: Get token from [https://github.com/settings/tokens](https://github.com/settings/tokens)

---

## Claude Code CLI Commands

### Import from Claude Desktop

\# Import all servers

claude mcp add-from-claude-desktop

\# List imported servers

claude mcp list

### Add Individual Servers

\# Simple server (no env vars)

claude mcp add context7 npx \-y @upstash/context7-mcp

\# Server with env vars (use JSON format)

claude mcp add-json firecrawl '{"command":"npx","args":\["-y","firecrawl-mcp"\],"env":{"FIRECRAWL\_API\_KEY":"fc-YOUR\_KEY"}}'

### Remove Servers

\# Remove specific server

claude mcp remove firecrawl

\# List all servers

claude mcp list

### Other Commands

\# Get server details

claude mcp get context7

\# Reset project choices

claude mcp reset-project-choices

\# Help

claude mcp help

---

## Ready-to-Use Prompts for Claude Code

Copy and paste these prompts directly into Claude Code to manage your MCP servers.

### add-all-mcps.md

Run \`claude mcp add-from-claude-desktop\` to import all MCP servers from my Claude Desktop configuration into this Claude Code project.

Check .claude/settings.local.json for result. advise to restart claude if necessary

Then show me which servers were imported by running \`claude mcp list\`.

Remind me to restart claude

### add-specific-mcp.md

Import these specific MCP servers from my Claude Desktop config (\~/Library/Application Support/Claude/claude\_desktop\_config.json) into this Claude Code project:

Use the appropriate \`claude mcp add\` or \`claude mcp add-json\` commands based on whether each server needs environment variables.

Services required:

\- context7

\- supabase  

\- firecrawl

Check .claude/settings.local.json for success

Remind me to restart claude

### add-project-scope-mcp.md

Use the Claude Code MCP CLI to configure MCP servers for this project:

\- Read my global Claude Desktop MCP configuration from \~/Library/Application Support/Claude/claude\_desktop\_config.json

\- Extract the configurations for the specified services below

\- Add them to this project using \`claude mcp add\` or \`claude mcp add-json\` commands as appropriate

\- Configuration will be stored in .claude/settings.local.json

Services required:

context7, supabase, firecrawl

Remind me to restart claude

### remove-specific-mcps.md

Remove the following MCP server from this Claude Code project using the \`claude mcp remove\` command:

Server to remove:

firecrawl

Remind me to restart claude

### remove-all-mcp.md

Remove all MCP servers from this Claude Code project:

1\. Run \`claude mcp list\` to see all configured servers

2\. For each server listed, run \`claude mcp remove \<server-name\>\`

3\. Confirm all servers are removed by running \`claude mcp list\` again

remind me to restsrt claude

### remove-allmcps-then-add.md

\#\# Remove All

Remove all MCP servers from this Claude Code project:

1\. Run \`claude mcp list\` to see all configured servers

2\. For each server listed, run \`claude mcp remove \<server-name\>\`

3\. Confirm all servers are removed by running \`claude mcp list\` again

\#\# Add MCP Servers

Import these specific MCP servers from my Claude Desktop config (\~/Library/Application Support/Claude/claude\_desktop\_config.json) into this Claude Code project:

Use the appropriate \`claude mcp add\` or \`claude mcp add-json\` commands based on whether each server needs environment variables.

Services required:

\- context7

\- supabase  

\- firecrawl

Check .claude/settings.local.json for success

Remind me to restart claude

---

## Troubleshooting

### Check Connection Status

\# View MCP logs

tail \-f \~/Library/Logs/Claude/mcp.log

\# List Claude Code servers

claude mcp list

\# Get specific server details

claude mcp get context7

### Common Issues

**MCP server not connecting:**

1. Restart Claude Desktop/VS Code completely  
2. Check logs for errors  
3. Verify API keys and tokens are correct  
4. Ensure npm packages exist: `npm search PACKAGE_NAME`

**Wrong username in searches:**

- GitHub username is case-sensitive  
- Verify actual username on GitHub profile

**Railway CLI authentication:**

- Browser login and CLI login are separate  
- Always run `railway login` for CLI access  
- Verify with `railway whoami`

---

## Security Notes

- Store API keys securely  
- Consider rotating tokens after sharing in chat  
- Never commit `.claude/settings.local.json` with secrets to git  
- Add to `.gitignore`:  
    
  .claude/settings.local.json  
    
  .mcp.json

---

## Quick Reference

| Task | Command/Location |
| :---- | :---- |
| View Claude Desktop config | `cat ~/Library/Application\ Support/Claude/claude_desktop_config.json` |
| Restart Claude Desktop | Cmd+Q, then reopen |
| Import to Claude Code | `claude mcp add-from-claude-desktop` |
| List Claude Code servers | `claude mcp list` |
| Remove server | `claude mcp remove <name>` |
| View logs | `tail -f ~/Library/Logs/Claude/mcp.log` |
| Check Railway login | `railway whoami` |

---

## Best Practices

1. **Use Claude Desktop as master config** \- Set up all MCP servers there first  
2. **Import to Claude Code per project** \- Use `claude mcp add-from-claude-desktop`  
3. **Test in Claude Desktop first** \- Verify servers work before using in Claude Code  
4. **Keep tokens secure** \- Rotate after sharing or if compromised  
5. **Use Claude Code for coding** \- Don't rely on VS Code Copilot for MCP  
6. **Document your setup** \- Keep notes on which services need which credentials  
7. **Always restart Claude** \- After adding/removing MCP servers, restart Claude Code or VS Code
