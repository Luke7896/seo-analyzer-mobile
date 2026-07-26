import { useCallback, useRef, useState } from 'react';
import { reportService, type FullReportDetails } from '../api/reportService';

type AuditState = 'idle' | 'polling' | 'ready' | 'error';

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 90; 

export function useAuditPolling() {
    const [state, setState] = useState<AuditState>('idle');
    const [report, setReport] = useState<FullReportDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const attemptsRef = useRef(0);

    const stopPolling = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const pollStatus = useCallback((reportId: string) => {
        timeoutRef.current = setTimeout(async () => {
            attemptsRef.current += 1;
            try {
                const { status } = await reportService.getReportStatus(reportId);

                if (status === 2) {
                    const fullReport = await reportService.getFullReport(reportId);
                    setReport(fullReport);
                    setState('ready');
                    return;
                }

                if (status === 3) {
                    setError('The audit failed to complete. Please try again.');
                    setState('error');
                    return;
                }

                if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
                    setError('This is taking longer than expected. Please try again shortly.');
                    setState('error');
                    return;
                }

                // status 0 (pending) or 1 (processing) 
                pollStatus(reportId);
            } catch (err) {
                console.error('Polling failed:', err);
                setError('Something went wrong while checking your report status.');
                setState('error');
            }
        }, POLL_INTERVAL_MS);
    }, []);

    const startAudit = useCallback(
        async (domain: string) => {
            setError(null);
            setReport(null);
            setState('polling');
            attemptsRef.current = 0;

            try {
                const { reportId, status } = await reportService.triggerFreeAudit(domain);

                if (status === 2) {
                    const fullReport = await reportService.getFullReport(reportId);
                    setReport(fullReport);
                    setState('ready');
                    return;
                }

                if (status === 3) {
                    setError('The audit failed to complete. Please try again.');
                    setState('error');
                    return;
                }

                pollStatus(reportId);
            } catch (err) {
                console.error('Failed to start audit:', err);
                setError('Failed to start the audit. Please check the URL and try again.');
                setState('error');
            }
        },
        [pollStatus]
    );

    const reset = useCallback(() => {
        stopPolling();
        setState('idle');
        setReport(null);
        setError(null);
    }, [stopPolling]);

    return { state, report, error, startAudit, reset, stopPolling };
}