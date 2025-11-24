import type {Root} from 'hast';
import {visit} from 'unist-util-visit';

/**
 * Rehype 插件：还原 XML 代码块中的反引号
 *
 * 背景：
 * - preprocessXmlToCodeBlock 会将工具调用的 XML 转换为 markdown 代码块
 * - 为了避免代码块中的 markdown 语法干扰，XML 中的 ``` 会被转义为 \`\`\`
 * - 同样地，为了避免 XML 标签被误解析，代码中的 ` 也会被转义为 \`
 *
 * 本插件：
 * - 在 AST 遍历过程中找到所有 <code> 节点
 * - 检查是否有 language-xml class 标记
 * - 将其中的 \` 还原为 `
 *
 * 这样就能正确显示 XML 代码块中的反引号字符了
 */
export default function rehypeUnescapeBackticks() {
    return (tree: Root) => {
        visit(
            tree,
            'element',
            node => {
                if (node.tagName === 'code' && node.properties.className) {
                    const classes = node.properties.className as string[];
                    const isXml = classes.some(c => c === 'language-xml');

                    if (isXml && node.children.length > 0) {
                        const textNode = node.children[0];
                        if (textNode.type === 'text') {
                            textNode.value = textNode.value.replaceAll('\\`', '`');
                        }
                    }
                }
            }
        );
    };
}
