import {Streamdown, defaultRehypePlugins, defaultRemarkPlugins} from 'streamdown';
import remarkBreaks from 'remark-breaks';
import styled from '@emotion/styled';
import rehypeUnescapeBackticks from './unescapeBackticks';

const REMARK_PLUGINS = [...Object.values(defaultRemarkPlugins), remarkBreaks];
const REHYPE_PLUGINS = [
    ...Object.entries(defaultRehypePlugins).filter(([key]) => key !== 'raw').map(([, plugin]) => plugin),
    rehypeUnescapeBackticks,
];

const StyledStreamdown = styled(Streamdown)`
    h1 {
        font-size: 2em;
        margin: 0.5em 0;
    }

    h2 {
        font-size: 1.8em;
        margin: 0.5em 0;
    }

    h3 {
        font-size: 1.6em;
        margin: 0.5em 0;
    }

    h4 {
        font-size: 1.4em;
        margin: 0.5em 0;
    }

    h5 {
        font-size: 1.3em;
        margin: 0.5em 0;
    }

    h6 {
        font-size: 1.2em;
        margin: 0.5em 0;
    }

    ul,
    ol {
        margin: 0.5em unset;
    }

    li {
        padding: 0;
    }

    p {
        line-height: 1.5;
        margin-bottom: .5em;
    }
`;

interface MarkdownContentProps {
    content: string;
}

export default function MarkdownContent({content}: MarkdownContentProps) {
    return (
        <StyledStreamdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
            {content}
        </StyledStreamdown>
    );
}
