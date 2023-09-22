import { getJestProjects } from '@nx/jest';
import type { Config } from 'jest';

export default {
    projects: getJestProjects(),
    displayName: 'rustify',
    preset: './jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': [
            'ts-jest',
            { tsconfig: '<rootDir>/tsconfig.spec.json' },
        ],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
} satisfies Config;
