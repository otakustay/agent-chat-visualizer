import {describe, test, expect} from 'vitest';
import {treeToGitGraphList} from '../utils';
import {ChangeType, type SnapshotNode} from '../../../interface';

describe('treeToGitGraphList', () => {
    test('单个根节点', () => {
        const root: SnapshotNode = {
            id: 'A',
            timestamp: Date.now(),
            changeType: ChangeType.Initial,
            data: {messages: []},
            children: [],
        };

        const result = treeToGitGraphList(root, {currentNode: root, generateNodeId: v => v.id});

        expect(result).toEqual(['commit id: "A" type: HIGHLIGHT']);
    });

    test('根节点带单个子节点', () => {
        const root: SnapshotNode = {
            id: 'A',
            timestamp: Date.now(),
            changeType: ChangeType.Initial,
            data: {messages: []},
            children: [
                {
                    id: 'B',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [],
                },
            ],
        };

        const result = treeToGitGraphList(root, {currentNode: root, generateNodeId: v => v.id});

        expect(result).toEqual(['commit id: "A" type: HIGHLIGHT', 'commit id: "B" type: NORMAL']);
    });

    test('根节点带多个子节点', () => {
        const root: SnapshotNode = {
            id: 'A',
            timestamp: Date.now(),
            changeType: ChangeType.Initial,
            data: {messages: []},
            children: [
                {
                    id: 'B',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [],
                },
                {
                    id: 'C',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [],
                },
            ],
        };

        const result = treeToGitGraphList(root, {currentNode: root, generateNodeId: v => v.id});
        const expected = [
            'commit id: "A" type: HIGHLIGHT',
            'branch Edit-C',
            'checkout Initial',
            'commit id: "B" type: NORMAL',
            'checkout Edit-C',
            'commit id: "C" type: NORMAL',
        ];
        expect(result).toEqual(expected);
    });

    test('复杂的多层树结构', () => {
        const root: SnapshotNode = {
            id: 'A',
            timestamp: Date.now(),
            changeType: ChangeType.Initial,
            data: {messages: []},
            children: [
                {
                    id: 'B',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [
                        {
                            id: 'C',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [
                                {
                                    id: 'D',
                                    timestamp: Date.now(),
                                    changeType: ChangeType.EditContent,
                                    data: {messages: []},
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 'E',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [
                                {
                                    id: 'F',
                                    timestamp: Date.now(),
                                    changeType: ChangeType.EditContent,
                                    data: {messages: []},
                                    children: [],
                                },
                            ],
                        },
                        {
                            id: 'G',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                    ],
                },
                {
                    id: 'H',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [
                        {
                            id: 'I',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                    ],
                },
            ],
        };

        const result = treeToGitGraphList(root, {currentNode: root, generateNodeId: v => v.id});
        const expected = [
            'commit id: "A" type: HIGHLIGHT',
            'branch Edit-H',
            'checkout Initial',
            'commit id: "B" type: NORMAL',
            'branch Edit-E',
            'branch Edit-G',
            'checkout Initial',
            'commit id: "C" type: NORMAL',
            'commit id: "D" type: NORMAL',
            'checkout Edit-E',
            'commit id: "E" type: NORMAL',
            'commit id: "F" type: NORMAL',
            'checkout Edit-G',
            'commit id: "G" type: NORMAL',
            'checkout Edit-H',
            'commit id: "H" type: NORMAL',
            'commit id: "I" type: NORMAL',
        ];
        expect(result).toEqual(expected);
    });

    test('三层深度的单链结构', () => {
        const root: SnapshotNode = {
            id: 'A',
            timestamp: Date.now(),
            changeType: ChangeType.Initial,
            data: {messages: []},
            children: [
                {
                    id: 'B',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [
                        {
                            id: 'C',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                    ],
                },
            ],
        };

        const result = treeToGitGraphList(root, {currentNode: root, generateNodeId: v => v.id});
        const expected = [
            'commit id: "A" type: HIGHLIGHT',
            'commit id: "B" type: NORMAL',
            'commit id: "C" type: NORMAL',
        ];
        expect(result).toEqual(expected);
    });

    test('每层都有多个分支的结构', () => {
        const root: SnapshotNode = {
            id: 'A',
            timestamp: Date.now(),
            changeType: ChangeType.Initial,
            data: {messages: []},
            children: [
                {
                    id: 'B',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [
                        {
                            id: 'D',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                        {
                            id: 'E',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                    ],
                },
                {
                    id: 'C',
                    timestamp: Date.now(),
                    changeType: ChangeType.EditContent,
                    data: {messages: []},
                    children: [
                        {
                            id: 'F',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                        {
                            id: 'G',
                            timestamp: Date.now(),
                            changeType: ChangeType.EditContent,
                            data: {messages: []},
                            children: [],
                        },
                    ],
                },
            ],
        };

        const result = treeToGitGraphList(root, {currentNode: root, generateNodeId: v => v.id});
        const expected = [
            'commit id: "A" type: HIGHLIGHT',
            'branch Edit-C',
            'checkout Initial',
            'commit id: "B" type: NORMAL',
            'branch Edit-E',
            'checkout Initial',
            'commit id: "D" type: NORMAL',
            'checkout Edit-E',
            'commit id: "E" type: NORMAL',
            'checkout Edit-C',
            'commit id: "C" type: NORMAL',
            'branch Edit-G',
            'checkout Edit-C',
            'commit id: "F" type: NORMAL',
            'checkout Edit-G',
            'commit id: "G" type: NORMAL',
        ];
        expect(result).toEqual(expected);
    });
});
