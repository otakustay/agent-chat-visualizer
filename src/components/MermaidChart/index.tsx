import {useEffect, useRef, useState} from 'react';
import mermaid from 'mermaid';
import classNames from 'classnames';
import {generateRandomId} from '@/utils/string';

interface MermaidChartProps {
    chart: string;
    className?: string;
    id?: string;
}
async function renderChart(chart: string, container: HTMLDivElement) {
    const chartId = `mermaid-${generateRandomId()}`;
    const {svg, bindFunctions} = await mermaid.render(chartId, chart.trim());
    container.innerHTML = svg;
    bindFunctions?.(container);
}

export default function MermaidChart({chart, className = '', id}: MermaidChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(
        () => {
            const container = containerRef.current;
            if (!chart || !container) {
                return;
            }

            const render = async () => {
                try {
                    setError(null);
                    await renderChart(chart, container);
                }
                catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Render failed';
                    setError(errorMessage);
                    console.error('Mermaid render failed:', err);
                }
            };

            void render();
        },
        [chart]
    );

    if (error) {
        return (
            <div className="text-red-500 p-4 border border-red-300 rounded">
                <p className="font-semibold">Chart Render Failed</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            id={id}
            className={classNames('h-full', className)}
        />
    );
}
