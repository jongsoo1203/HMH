export interface Trial {
    nctId: string;
    title: string;
    condition: Array<string>;
    conditionKeywords: Array<string>;
    phase: string;
    locations: Array<any>;
    startDate: string;
    status: string;
    participants: string;
}