import type {Options} from '@ecomfe/eslint-config';
import {configure} from '@ecomfe/eslint-config';

const options: Options = {
    strict: true,
    react: {},
    typeScript: {
        typeCheck: true,
    },
};

export default [
    {
        ignores: ['dist/**'],
    },
    ...configure(options),
    {
        rules: {
            '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
            '@stylistic/max-len': [
                'error',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
        },
    },
];
