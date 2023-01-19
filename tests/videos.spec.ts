import { test, expect } from '@playwright/test';
import fs from 'fs/promises';

const YT_URL_ROOT = 'https://www.youtube.com/watch?v=';

const VIDEO_URLS = [
  // Stop recording views for old videos.
  // { id: 'kv6Q8a9bsbA', name: 'whats new 101' },
  // { id: 'JY6DfhSdr_A', name: 'whats new 102' },
  // { id: 'hdrR0QwXpuc', name: 'memory/perf debugging' },
  // { id: 'aa0C6BRdaPA', name: 'whats new 103' },
  // { id: '0_ZprFX8x0I', name: 'whats new 104' },
  // { id: 'h0XJH_iLoUk', name: 'whats new 105' },
  // { id: 'ayemJLeE55c', name: 'learn devtools ui' },
  // { id: 'LJxjFo4DuA0', name: 'whats new 106' },
  { id: 'niG_Ck6E5L8', name: 'Network crash course' },
  // { id: 'QcAnrbfJN0s', name: 'whats new 107' },
  // { id: '2fuTHag4EOw', name: 'OLD whats new 108' },
  { id: 'KmGXnsSCtI4', name: 'whats new 108' },
  { id: 'b-q-PLmO-ns', name: 'whats new 109' },
];


test('Retrieving video views', async ({ page }) => {
  const existingJSONContent = await fs.readFile('VIEWS.json', {encoding:'utf8'});
  const data = JSON.parse(existingJSONContent);

  for (const { id, name } of VIDEO_URLS) {
    console.log(`    > Checking video: ${name}`);
    const url = YT_URL_ROOT + id;
    await page.goto(url);

    const snippetLocator = page.locator('.view-count');
    await snippetLocator.waitFor({ state: 'attached' });

    let views = 0;

    const span = await page.$('.view-count');
    if (span) {
      const text = await span.textContent() || '';
      views = parseInt(text.trim().replace(/[^\d]+/g, ''), 10);
    }

    if (!data[id]) {
      data[id] = {
        name,
        url,
        views: []
      };
    }

    data[id].views.push({date: Date.now(), views});
  }

  await fs.writeFile('VIEWS.json', JSON.stringify(data, null, 2), {encoding: 'utf8'});
});
