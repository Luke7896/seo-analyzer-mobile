import {axiosClient} from './axiosClient';



export interface ReportStatus {
    reportId: string,
    status: number
}

export interface FullReportDetails {
    id: string;
    domain: string;
    status: number;
    tier: number;
    createdAt: string;
    brokenPagesCount: number;
    haveIssuesPagesCount: number;
    healthyPagesCount: number;
    redirectPagesCount: number;
    siteErrorsCount: number;
    siteWarningsCount: number;
    siteNoticesCount: number;
    siteHealthScore: number;
    totalPagesCrawled: number;
    aiSearchScore?: number;
    aiSearchHealth?: number;

   
}

export const reportService = {

    getReportStatus: async ( reportId: string ): Promise<ReportStatus> => {
        const response = await axiosClient.get<ReportStatus>(`/api/reports/${reportId}/status`);
        return response.data;
    },

    getFullReport: async (reportId: string): Promise<FullReportDetails> => {
        const response = await axiosClient.get<FullReportDetails>(`/api/reports/${reportId}`);
        return response.data;
    },

    triggerFreeAudit: async (domain: string): Promise<ReportStatus> => {
    const response = await axiosClient.post<ReportStatus>('/api/reports/audit/free', { domain });
    return response.data;
    },

};

