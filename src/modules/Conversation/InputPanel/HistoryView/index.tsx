import MermaidChart from '@/components/MermaidChart';
import {useSnapshotRootValue} from '@/atoms/conversation';
import type {SnapshotNode} from '../../interface';
import {treeToGitGraphList} from './utils';
import styled from '@emotion/styled';


interface HistoryViewProps {
    current: SnapshotNode;
    onCurrentSnapshotChange: (node: SnapshotNode) => void;
    onViewChange: (view: 'source' | 'history') => void;
}

function findNodeById(node: SnapshotNode, id: string): SnapshotNode | null {
    if (node.id === id) {
        return node;
    }

    for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) {
            return found;
        }
    }

    return null;
}

const Layout = styled.div`
    #history-view-mermaid .commit-bullets circle {
        cursor: pointer;
    }

    #history-view-mermaid .commit-bullets circle:hover {
        filter: contrast(1.2);
    }
`;

const HistoryView = ({current, onCurrentSnapshotChange, onViewChange}: HistoryViewProps) => {
    const root = useSnapshotRootValue();

    const handleNodeClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() !== 'circle') {
            return;
        }
        const nodeId = Array.from(target.classList).at(1);
        if (!nodeId) {
            return;
        }
        const found = findNodeById(root, nodeId);
        if (found) {
            onCurrentSnapshotChange(found);
            onViewChange('source');
        }
    };

    const graphLines = treeToGitGraphList(root, {currentNode: current});
    const lines: string[] = [
        '---',
        'config:',
        '  theme: base',
        '  gitGraph:',
        '    showBranches: false',
        '    showCommitLabel: true',
        '    mainBranchName: Initial',
        '---',
        'gitGraph BT:',
        ...graphLines.map(v => `  ${v}`),
    ];
    const mermaidChart = lines.join('\n');

    return (
        <Layout className="h-full overflow-auto p-4 bg-gray-50" onClick={handleNodeClick}>
            <MermaidChart chart={mermaidChart} id="history-view-mermaid" />
        </Layout>
    );
};

export default HistoryView;
