# mcp-tle

TLE MCP — satellite tracking via Two-Line Element sets (tle.ivanstanojevic.me, free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_tle` | Fetch the Two-Line Element (TLE) set for a specific satellite by its NORAD catalog ID. Returns the satellite name, epoch date, and both TLE lines. |
| `search_satellites` | Search for satellites by name or keyword. Returns matching satellites with their NORAD IDs and TLE data. |
| `list_recent` | List the most recently launched or updated satellites, sorted by epoch date descending. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "tle": {
      "url": "https://gateway.pipeworx.io/tle/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Tle data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
