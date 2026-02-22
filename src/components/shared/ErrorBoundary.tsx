'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">문제가 발생했습니다.</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                        요청하신 작업을 처리하는 중에 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="flex items-center gap-2 px-6 py-3 bg-ocean-teal hover:bg-ocean-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-ocean-teal/20"
                    >
                        <RotateCcw size={18} /> 다시 시도
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-8 p-4 bg-slate-50 dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800 text-left w-full overflow-auto max-h-40">
                            <p className="text-xs font-mono text-rose-500">{this.state.error?.toString()}</p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
