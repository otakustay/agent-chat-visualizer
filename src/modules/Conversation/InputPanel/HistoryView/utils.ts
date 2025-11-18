import type {SnapshotNode} from '../../interface';

const DEFAULT_BRANCH = 'Initial';

interface TraverseTarget {
    node: SnapshotNode;
    nodeBranch: string;
}

interface TraverseState {
    currentBranch: string;
    output: string[];
    current: SnapshotNode;
    generateNodeId: (node: SnapshotNode) => string;
}

function outputNode(target: TraverseTarget, state: TraverseState) {
    if (target.nodeBranch !== state.currentBranch) {
        state.output.push(`checkout ${target.nodeBranch}`);
        state.currentBranch = target.nodeBranch;
    }

    const commitType = target.node === state.current ? 'HIGHLIGHT' : 'NORMAL';
    state.output.push(`commit id: "${state.generateNodeId(target.node)}" type: ${commitType}`);

    for (const branchNode of target.node.children.slice(1)) {
        const branchName = `Edit-${branchNode.id}`;
        state.output.push(`branch ${branchName}`);
        state.currentBranch = branchName;
    }

    for (let i = 0; i < target.node.children.length; i++) {
        const child = target.node.children[i];
        const nodeBranch = i === 0 ? target.nodeBranch : `Edit-${child.id}`;
        outputNode({node: child, nodeBranch}, state);
    }
}

interface TreeToGitGraphOptions {
    currentNode: SnapshotNode;
    generateNodeId: (node: SnapshotNode) => string;
}

export function treeToGitGraphList(root: SnapshotNode, options: TreeToGitGraphOptions): string[] {
    const target: TraverseTarget = {node: root, nodeBranch: DEFAULT_BRANCH};
    const state: TraverseState = {
        currentBranch: DEFAULT_BRANCH,
        output: [],
        current: options.currentNode,
        generateNodeId: options.generateNodeId,
    };
    outputNode(target, state);
    return state.output;
}
