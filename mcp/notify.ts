#!/usr/bin/env node
import dedent from 'dedent';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {NotificationCenter} from 'node-notifier';
import {z} from 'zod';

const notification = new NotificationCenter();
const server = new McpServer({name: 'notify-server', version: '1.0.0'});

type NotifyOptions = Parameters<typeof notification['notify']>[0];

interface McpReturnChunk {
    type: 'text';
    text: string;
}

interface McpReturn {
    [key: string]: unknown;
    content: McpReturnChunk[];
}

server.registerTool(
    'notify',
    {
        description: dedent`
            Send a blocking notification to user and wait for user confirmation.

            By using this tool, user will receive a system level notification whatever he is doing, you will then get the result when user respond to notification.

            Always use this tool where you are designed to envolve user into task validation or decision making process, user may help to make a yes/no decision, or give a visual or interaction testing result.

            Notification is not capable to carry large amount of text to user, you should always output a detailed guideline on what user should do before you call this tool, user will follow your instructions to accomplish his task.
        `,
        inputSchema: {
            title: z.string().describe('Notification title'),
            body: z.string().describe('Notification body content'),
            action: z.string().optional().describe('Optional close button label'),
        },
    },
    async ({title, body, action}) => {
        const options: NotifyOptions = {
            title,
            message: body,
            timeout: Infinity,
            closeLabel: action,
        };
        const executor = (resolve: (value: McpReturn) => void) => {
            notification.notify(
                options,
                (err, response, metadata) => {
                    if (err) {
                        const returnValue: McpReturn = {
                            content: [
                                {
                                    type: 'text',
                                    text: `通知发送失败: ${err.message}`,
                                },
                            ],
                        };
                        resolve(returnValue);
                        return;
                    }

                    const result: Record<string, unknown> = {
                        response,
                    };

                    if (metadata) {
                        if (metadata.activationType) {
                            result.activationType = metadata.activationType;
                        }
                        if (metadata.activationAt) {
                            result.activationAt = metadata.activationAt;
                        }
                        if (metadata.activationValue) {
                            result.activationValue = metadata.activationValue;
                        }
                        if (metadata.activationValueIndex !== undefined) {
                            result.activationValueIndex = metadata.activationValueIndex;
                        }
                    }

                    const returnValue: McpReturn = {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                    resolve(returnValue);
                }
            );
        };
        return new Promise(executor);
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(console.error);
