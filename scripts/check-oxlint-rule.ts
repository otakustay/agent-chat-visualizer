import {load} from 'cheerio';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

interface Rule {
    name: string;
    source: string;
}

function parseRuleFromRow($: ReturnType<typeof load>, element: Element): Rule | null {
    const cells = $(element).find('td');
    if (cells.length < 2) {
        return null;
    }

    const name = $(cells[0]).text().trim();
    const source = $(cells[1]).text().trim();

    if (!name || !source) {
        return null;
    }

    return {name, source};
}

async function fetchOxlintRules(): Promise<Rule[]> {
    const response = await fetch('https://oxc.rs/docs/guide/usage/linter/rules.html');
    const html = await response.text();
    const $ = load(html);

    const rules = $('tbody > tr')
        .map((_, element) => parseRuleFromRow($, element))
        .get()
        .filter((rule): rule is Rule => rule !== null);

    return rules;
}

function readOxlintConfig() {
    const configPath = join(process.cwd(), '.oxlintrc.json');
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content);
}

async function main() {
    console.log('Fetching oxlint rules from official website...\n');
    const allRules = await fetchOxlintRules();

    console.log('Reading .oxlintrc.json...\n');
    const config = readOxlintConfig();

    const plugins = config.plugins || [];
    const currentRules = Object.keys(config.rules || {});

    console.log(`Plugins enabled: ${plugins.join(', ')}`);
    console.log(`Current rules count: ${currentRules.length}\n`);

    const existingRules: string[] = [];
    const missingRules: string[] = [];

    // 按 source 分组统计
    const rulesBySource = new Map<string, {total: number, existing: number, missing: string[]}>();

    for (const rule of allRules) {
        if (!plugins.includes(rule.source)) {
            continue;
        }

        if (!rulesBySource.has(rule.source)) {
            rulesBySource.set(rule.source, {total: 0, existing: 0, missing: []});
        }

        const stats = rulesBySource.get(rule.source);
        if (!stats) {
            continue;
        }
        stats.total++;

        const fullRuleName = `${rule.source}/${rule.name}`;
        const shortRuleName = rule.name;

        if (currentRules.includes(fullRuleName) || currentRules.includes(shortRuleName)) {
            existingRules.push(fullRuleName);
            stats.existing++;
        }
        else {
            missingRules.push(fullRuleName);
            stats.missing.push(rule.name);
        }
    }

    console.log('=== Statistics ===');
    console.log(`Total rules checked: ${allRules.length}`);
    console.log(`Existing rules: ${existingRules.length}`);
    console.log(`Missing rules: ${missingRules.length}\n`);

    console.log('=== By Source ===');
    for (const [source, stats] of rulesBySource.entries()) {
        console.log(`${source}: ${stats.existing}/${stats.total} configured`);
    }

    console.log('\n=== Missing Rules ===');

    if (missingRules.length === 0) {
        console.log('No missing rules!');
    }
    else {
        for (const [source, stats] of rulesBySource.entries()) {
            if (stats.missing.length > 0) {
                console.log(`\n${source}:`);
                for (const rule of stats.missing) {
                    console.log(`  - ${rule}`);
                }
            }
        }
    }
}

main().catch(ex => {
    console.error('Error:', ex);
    process.exit(1);
});
