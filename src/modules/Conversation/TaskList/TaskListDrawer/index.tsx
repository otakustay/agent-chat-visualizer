import Drawer from '@/components/Drawer';
import {useSetTaskDrawerOpen, useTaskDrawerOpen} from '@/atoms/ui';
import TaskTimeline from '../TaskTimeline';

export default function TaskListDrawer() {
    const open = useTaskDrawerOpen();
    const setOpen = useSetTaskDrawerOpen();

    return (
        <Drawer open={open} onClose={() => setOpen(false)} title="Tasks">
            <TaskTimeline />
        </Drawer>
    );
}
