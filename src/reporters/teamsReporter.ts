import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as https from 'https';

const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL ?? '';
const SEND_TEAMS_REPORT = process.env.SEND_TEAMS_REPORT === 'true';
const SHOW_HTML_REPORT_BUTTON = process.env.SHOW_HTML_REPORT_BUTTON === 'true';
const PLAYWRIGHT_REPORT_URL = process.env.PLAYWRIGHT_REPORT_URL ?? '';

function postToTeams(payload: object): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const url = new URL(TEAMS_WEBHOOK_URL);
    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

type TableRow = object;

function makeRow(label: string, value: string, color?: string, bold?: boolean): TableRow {
  return {
    type: 'TableRow',
    cells: [
      {
        type: 'TableCell',
        items: [{ type: 'TextBlock', text: label, ...(color ? { color } : {}), ...(bold ? { weight: 'Bolder' } : {}) }],
      },
      {
        type: 'TableCell',
        items: [{ type: 'TextBlock', text: value, ...(color ? { color } : {}), weight: 'Bolder' }],
      },
    ],
  };
}

function buildAdaptiveCard(
  passed: number,
  failed: number,
  skipped: number,
  flaky: number,
  total: number,
  durationMs: number,
): object {
  const statusEmoji = failed > 0 ? '❌' : '✅';
  const statusText = failed > 0 ? 'FAILED' : 'PASSED';
  const statusColor = failed > 0 ? 'attention' : 'good';
  const durationSec = (durationMs / 1000).toFixed(1);
  const passRate = total > 0 ? (((passed + flaky) / total) * 100).toFixed(1) + '%' : 'N/A';
  const timestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });

  const headerRow: TableRow = {
    type: 'TableRow',
    style: 'emphasis',
    cells: [
      { type: 'TableCell', items: [{ type: 'TextBlock', text: 'Metric', weight: 'Bolder' }] },
      { type: 'TableCell', items: [{ type: 'TextBlock', text: 'Count', weight: 'Bolder' }] },
    ],
  };

  const rows: TableRow[] = [
    headerRow,
    makeRow('📋 Total Tests', String(total), undefined, true),
    makeRow('✅ Passed', String(passed), 'good'),
    makeRow('❌ Failed', String(failed), failed > 0 ? 'attention' : 'default'),
  ];

  if (flaky > 0) {
    rows.push(makeRow('⚠️ Flaky', String(flaky), 'warning'));
  }

  if (skipped > 0) {
    rows.push(makeRow('⏭ Skipped', String(skipped), 'warning'));
  }

  rows.push(makeRow('📊 Pass Rate', passRate, undefined, true));

  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: `${statusEmoji} Playwright Test Run — ${statusText}`,
              size: 'Large',
              weight: 'Bolder',
              color: statusColor,
              wrap: true,
            },
            {
              type: 'TextBlock',
              text: `📅 ${timestamp}   ⏱ ${durationSec}s`,
              size: 'Small',
              isSubtle: true,
              wrap: true,
              spacing: 'None',
            },
            {
              type: 'Table',
              gridStyle: 'accent',
              firstRowAsHeader: true,
              columns: [
                { width: 2 },
                { width: 1 },
              ],
              rows,
            },
          ],
          ...(SHOW_HTML_REPORT_BUTTON && PLAYWRIGHT_REPORT_URL
            ? {
                actions: [
                  {
                    type: 'Action.OpenUrl',
                    title: '📄 View HTML Report',
                    url: PLAYWRIGHT_REPORT_URL,
                  },
                ],
              }
            : {}),
        },
      },
    ],
  };
}

class TeamsReporter implements Reporter {
  private results = new Map<string, 'passed' | 'failed' | 'flaky' | 'skipped'>();
  private startTime = Date.now();

  onTestEnd(test: TestCase, result: TestResult): void {
    const key = test.id;
    const current = this.results.get(key);

    if (result.status === 'passed') {
      // If it passed after a retry, it's flaky
      this.results.set(key, result.retry > 0 ? 'flaky' : 'passed');
    } else if (result.status === 'skipped') {
      if (!current) {
        this.results.set(key, 'skipped');
      }
    } else {
      // failed, timedOut, interrupted — only mark failed if not already resolved as passed/flaky
      if (current !== 'passed' && current !== 'flaky') {
        this.results.set(key, 'failed');
      }
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    let passed = 0, failed = 0, skipped = 0, flaky = 0;
    for (const status of this.results.values()) {
      if (status === 'passed') passed++;
      else if (status === 'failed') failed++;
      else if (status === 'skipped') skipped++;
      else if (status === 'flaky') flaky++;
    }

    const total = passed + failed + skipped + flaky;
    const durationMs = Date.now() - this.startTime;

    const card = buildAdaptiveCard(
      passed,
      failed,
      skipped,
      flaky,
      total,
      durationMs,
    );

    if (!SEND_TEAMS_REPORT) {
      console.log('\n📭 Teams report skipped (SEND_TEAMS_REPORT is not set to true).');
      return;
    }

    if (!TEAMS_WEBHOOK_URL) {
      console.error('\n⚠️  Teams report skipped: TEAMS_WEBHOOK_URL is not set.');
      return;
    }

    try {
      await postToTeams(card);
      console.log('\n📨 Teams report sent successfully.');
    } catch (err) {
      console.error('\n⚠️  Failed to send Teams report:', err);
    }
  }
}

export default TeamsReporter;
