interface NormalState {
    type: 'NORMAL';
}

interface InCodeBlockState {
    type: 'IN_CODE_BLOCK';
}

interface InXmlState {
    type: 'IN_XML';
    xmlTagName: string;
}

type State = NormalState | InCodeBlockState | InXmlState;

function processNormalState(line: string, result: string[]): State {
    if (/^\s*```/.test(line)) {
        result.push(line);
        return {type: 'IN_CODE_BLOCK'};
    }

    const xmlStartMatch = /^\s*<(\w+)>$/.exec(line);
    if (xmlStartMatch) {
        result.push('```xml');
        result.push(line);
        return {type: 'IN_XML', xmlTagName: xmlStartMatch[1]};
    }

    result.push(line);
    return {type: 'NORMAL'};
}

function processCodeBlockState(line: string, result: string[]): State {
    result.push(line);
    if (/^\s*```\s*$/.test(line)) {
        return {type: 'NORMAL'};
    }
    return {type: 'IN_CODE_BLOCK'};
}

function processXmlState(line: string, state: InXmlState, result: string[]): State {
    result.push(line.replace(/```/g, '\\`\\`\\`'));

    if (new RegExp(`^\\s*</${state.xmlTagName}>\\s*$`).test(line)) {
        result.push('```');
        return {type: 'NORMAL'};
    }

    return state;
}

interface StateContainer {
    current: State;
}

/**
 * 将 Markdown 文本中独立成行的 XML 块转换为代码块格式
 *
 * 识别规则：
 *
 * 1. XML 的开始标签必须独占一行（如 `<tool_result>``）
 * 2. XML 的结束标签必须独占一行（如 `</tool_result>`）
 * 3. 开始和结束标签之间可以包含任意内容，包括空行
 * 4. 已经在代码块中的 XML 不会被处理
 *
 * 转换示例：
 *
 * 输入：
 *
 * ```
 * <tool_result>
 * <status>succeeded</status>
 * </tool_result>
 * ```
 *
 * 输出：
 *
 * ```
 * \`\`\`xml
 * <tool_result>
 * <status>succeeded</status>
 * </tool_result>
 * \`\`\`
 * ```
 *
 * @param content - 原始 Markdown 文本
 * @returns 处理后的 Markdown 文本
 */
export function preprocessXmlToCodeBlock(content: string): string {
    const lines = content.split('\n');
    const result: string[] = [];
    const state: StateContainer = {current: {type: 'NORMAL'}};

    for (const line of lines) {
        switch (state.current.type) {
            case 'NORMAL':
                state.current = processNormalState(line, result);
                break;
            case 'IN_CODE_BLOCK':
                state.current = processCodeBlockState(line, result);
                break;
            case 'IN_XML':
                state.current = processXmlState(line, state.current, result);
                break;
        }
    }

    return result.join('\n');
}
