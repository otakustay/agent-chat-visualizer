import {useInputPanelView} from '@/atoms/ui';
import SourceView from './SourceView';
import HistoryView from './HistoryView';

const InputView = () => {
    const currentView = useInputPanelView();

    return (
        <div className="flex-1 overflow-auto">
            {currentView === 'source' ? <SourceView /> : <HistoryView />}
        </div>
    );
};

export default InputView;
