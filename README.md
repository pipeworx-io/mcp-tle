# mcp-tle

MCP server for satellite tracking via Two-Line Element (TLE) sets from [tle.ivanstanojevic.me](https://tle.ivanstanojevic.me/). Free, no auth required.

## Tools

| Tool | Description |
|------|-------------|
| `get_tle` | Fetch TLE data for a satellite by NORAD catalog ID |
| `search_satellites` | Search satellites by name or keyword |
| `list_recent` | List the most recently launched/updated satellites |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "tle_get_tle",
      "arguments": { "norad_id": 25544 }
    },
    "id": 1
  }'
```

## License

MIT
