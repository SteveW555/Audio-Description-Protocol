## Remove All
Remove all MCP servers from this Claude Code project:
1. Run `claude mcp list` to see all configured servers
2. For each server listed, run `claude mcp remove <server-name>`
3. Confirm all servers are removed by running `claude mcp list` again

## Add MCP Servers
Import these specific MCP servers from my Claude Desktop config (~/Library/Application Support/Claude/claude_desktop_config.json) into this Claude Code project:

Use the appropriate `claude mcp add` or `claude mcp add-json` commands based on whether each server needs environment variables.

Services required:
- context7
- supabase  
- firecrawl



Check .claude/settings.local.json for success

Remind me to restart claude