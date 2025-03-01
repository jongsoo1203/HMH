import { NextResponse } from 'next/server';

const API_BASE_URL = "https://clinicaltrials.gov/api/v2/studies";

export async function getTrials() {
    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch" },
            { status: 500 }
        );
    }
}