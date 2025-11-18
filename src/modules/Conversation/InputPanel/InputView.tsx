import type {SnapshotNode} from '../interface';
import SourceView from './SourceView';
import HistoryView from './HistoryView';

interface InputViewProps {
    currentView: 'source' | 'history';
    currentSnapshot: SnapshotNode;
    onCurrentSnapshotChange: (snapshot: SnapshotNode) => void;
    onViewChange: (view: 'source' | 'history') => void;
}

const InputView = ({currentView, currentSnapshot, onCurrentSnapshotChange, onViewChange}: InputViewProps) => {
    return (
        <div className="flex-1 overflow-auto">
            {
                currentView === 'source'
                    ? <SourceView data={currentSnapshot.data} />
                    : (
                        <HistoryView
                            current={currentSnapshot}
                            onCurrentSnapshotChange={onCurrentSnapshotChange}
                            onViewChange={onViewChange}
                        />
                    )
            }
        </div>
    );
};

export default InputView;
