/**
 * TLE MCP — satellite tracking via Two-Line Element sets (tle.ivanstanojevic.me, free, no auth)
 *
 * Tools:
 * - get_tle: Fetch TLE data for a satellite by NORAD catalog ID
 * - search_satellites: Search satellites by name or keyword
 * - list_recent: List the most recently launched/added satellites
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://tle.ivanstanojevic.me/api/tle';

type TleRecord = {
  satelliteId: number;
  name: string;
  date: string;
  line1: string;
  line2: string;
};

type TleSearchResponse = {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: TleRecord[];
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_tle',
    description:
      'Fetch the Two-Line Element (TLE) set for a specific satellite by its NORAD catalog ID. Returns the satellite name, epoch date, and both TLE lines.',
    inputSchema: {
      type: 'object',
      properties: {
        norad_id: {
          type: 'number',
          description:
            'NORAD catalog number for the satellite (e.g. 25544 for the ISS, 20580 for Hubble Space Telescope).',
        },
      },
      required: ['norad_id'],
    },
  },
  {
    name: 'search_satellites',
    description:
      'Search for satellites by name or keyword. Returns matching satellites with their NORAD IDs and TLE data.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Name or keyword to search for (e.g. "ISS", "Starlink", "GPS").',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return. Defaults to 10.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_recent',
    description:
      'List the most recently launched or updated satellites, sorted by epoch date descending.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of satellites to return. Defaults to 10.',
        },
      },
    },
  },
];

function formatTle(record: TleRecord) {
  return {
    norad_id: record.satelliteId,
    name: record.name,
    epoch: record.date,
    line1: record.line1,
    line2: record.line2,
  };
}

async function getTle(noradId: number): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/${noradId}`);
  if (!res.ok) throw new Error(`TLE API error: ${res.status}`);

  const data = (await res.json()) as TleRecord;
  return formatTle(data);
}

async function searchSatellites(query: string, limit: number): Promise<unknown> {
  const params = new URLSearchParams({
    search: query,
    'page-size': String(limit),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`TLE API error: ${res.status}`);

  const data = (await res.json()) as TleSearchResponse;

  return {
    total: data.totalItems,
    query,
    satellites: data.member.map(formatTle),
  };
}

async function listRecent(limit: number): Promise<unknown> {
  const params = new URLSearchParams({
    sort: 'date',
    'sort-dir': 'desc',
    'page-size': String(limit),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`TLE API error: ${res.status}`);

  const data = (await res.json()) as TleSearchResponse;

  return {
    total: data.totalItems,
    satellites: data.member.map(formatTle),
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_tle':
      return getTle(args.norad_id as number);
    case 'search_satellites':
      return searchSatellites(args.query as string, (args.limit as number | undefined) ?? 10);
    case 'list_recent':
      return listRecent((args.limit as number | undefined) ?? 10);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
