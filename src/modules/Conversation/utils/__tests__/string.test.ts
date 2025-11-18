import dedent from 'dedent';
import {describe, expect, test} from 'vitest';
import {preprocessXmlToCodeBlock} from '../string';

describe('preprocessXmlToCodeBlock', () => {
    test('should convert basic XML to code block', () => {
        const input = dedent`
            <tool_result>
            <status>succeeded</status>
            </tool_result>
        `;

        const expected = dedent`
            \`\`\`xml
            <tool_result>
            <status>succeeded</status>
            </tool_result>
            \`\`\`
        `;
        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should convert XML with empty lines', () => {
        const input = dedent`
            <tool_result>
            <status>succeeded</status>

            <message>执行成功</message>
            </tool_result>
        `;

        const expected = dedent`
            \`\`\`xml
            <tool_result>
            <status>succeeded</status>

            <message>执行成功</message>
            </tool_result>
            \`\`\`
        `;
        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should skip XML already in code blocks', () => {
        const input = dedent`
            \`\`\`xml
            <existing>已经在代码块中</existing>
            \`\`\`

            <tool_result>
            <status>succeeded</status>
            </tool_result>
        `;

        const expected = dedent`
            \`\`\`xml
            <existing>已经在代码块中</existing>
            \`\`\`

            \`\`\`xml
            <tool_result>
            <status>succeeded</status>
            </tool_result>
            \`\`\`
        `;

        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should convert multiple XML blocks', () => {
        const input = dedent`
            <first>
            内容1
            </first>

            <second>
            内容2
            </second>
        `;

        const expected = dedent`
            \`\`\`xml
            <first>
            内容1
            </first>
            \`\`\`

            \`\`\`xml
            <second>
            内容2
            </second>
            \`\`\`
        `;

        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should handle XML with leading and trailing whitespace', () => {
        const input = dedent`
              <tool_result>
            <status>succeeded</status>
            </tool_result>
        `;

        const expected = dedent`
            \`\`\`xml
            <tool_result>
            <status>succeeded</status>
            </tool_result>
            \`\`\`
        `;
        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should not convert inline XML', () => {
        const input = 'This is some text with <inline>XML</inline> in it.';
        expect(preprocessXmlToCodeBlock(input)).toBe(input);
    });

    test('should preserve non-XML code blocks', () => {
        const input = dedent`
            \`\`\`javascript
            const x = 1;
            \`\`\`

            <tool_result>
            <status>succeeded</status>
            </tool_result>
        `;

        const expected = dedent`
            \`\`\`javascript
            const x = 1;
            \`\`\`

            \`\`\`xml
            <tool_result>
            <status>succeeded</status>
            </tool_result>
            \`\`\`
        `;

        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should handle nested XML tags', () => {
        const input = dedent`
            <tool_result>
            <status>
            <code>200</code>
            <message>OK</message>
            </status>
            </tool_result>
        `;

        const expected = dedent`
            \`\`\`xml
            <tool_result>
            <status>
            <code>200</code>
            <message>OK</message>
            </status>
            </tool_result>
            \`\`\`
        `;
        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should handle complex real-world example', () => {
        const input = dedent`
            这是一段说明

            \`\`\`xml
            <existing>已经在代码块中</existing>
            \`\`\`

            下面是工具返回：

            <tool_result>
            <status>
            succeeded
            </status>
            <message>
            执行成功
            </message>
            <new_file_content>
            ...
            </new_file_content>
            </tool_result>

            任务完成。
        `;

        const expected = dedent`
            这是一段说明

            \`\`\`xml
            <existing>已经在代码块中</existing>
            \`\`\`

            下面是工具返回：

            \`\`\`xml
            <tool_result>
            <status>
            succeeded
            </status>
            <message>
            执行成功
            </message>
            <new_file_content>
            ...
            </new_file_content>
            </tool_result>
            \`\`\`

            任务完成。
        `;

        expect(preprocessXmlToCodeBlock(input)).toBe(expected);
    });

    test('should handle XML containing markdown code blocks', () => {
        const input = [
            '<tool_result>',
            '<content>',
            '```javascript',
            'const x = 1;',
            '```',
            '</content>',
            '</tool_result>',
        ];

        const expected = [
            '```xml',
            '<tool_result>',
            '<content>',
            '\\`\\`\\`javascript',
            'const x = 1;',
            '\\`\\`\\`',
            '</content>',
            '</tool_result>',
            '```',
        ];

        expect(preprocessXmlToCodeBlock(input.join('\n'))).toBe(expected.join('\n'));
    });

    test('should handle XML with multiple code blocks inside', () => {
        const input = [
            '<tool_result>',
            '<file1>',
            '```typescript',
            'type A = string;',
            '```',
            '</file1>',
            '<file2>',
            '```javascript',
            'const x = 1;',
            '```',
            '</file2>',
            '</tool_result>',
        ];

        const expected = [
            '```xml',
            '<tool_result>',
            '<file1>',
            '\\`\\`\\`typescript',
            'type A = string;',
            '\\`\\`\\`',
            '</file1>',
            '<file2>',
            '\\`\\`\\`javascript',
            'const x = 1;',
            '\\`\\`\\`',
            '</file2>',
            '</tool_result>',
            '```',
        ];

        expect(preprocessXmlToCodeBlock(input.join('\n'))).toBe(expected.join('\n'));
    });
});
