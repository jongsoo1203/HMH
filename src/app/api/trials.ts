import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { type Trial } from "../types/trial";

const API_BASE_URL = "https://clinicaltrials.gov/api/v2/studies?postFilter.overallStatus=RECRUITING,AVAILABLE,ENROLLING_BY_INVITATION,NOT_YET_RECRUITING&countTotal=true&pageSize=20&sort=@relevance";
const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabase_url, supabase_anon_key);

export async function getTrials() {
    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json_response = await response.json();
        // console.log(json_response)

        // Correctly map the data structure based on the console output
        const trials: Trial[] = json_response.studies.map((study: { protocolSection: any }) => {
            const protocolSection = study.protocolSection || {};

            return {
                nctId: protocolSection.identificationModule?.nctId || 'Unknown ID',
                title: protocolSection.identificationModule?.briefTitle || 'No Title',
                conditions: protocolSection.conditionsModule?.conditions || [],
                conditionKeywords: protocolSection.conditionsModule?.keywords || [],
                phase: protocolSection.designModule?.phases?.[0] || 'Not Specified',
                locations: Array.from(new Set(protocolSection.contactsLocationsModule?.locations || [])),
                startDate: protocolSection.statusModule?.startDateStruct?.date || 'Unknown',
                status: protocolSection.statusModule?.overallStatus || 'Unknown',
                participants: protocolSection.designModule?.enrollmentInfo?.count || 'Not Specified',
                description: protocolSection.descriptionModule?.detailedDescription || 'No Description',
                eligibilityCriteria: protocolSection.eligibilityModule?.eligibilityCriteria || 'No Criteria',
                sex: protocolSection.eligibilityModule?.sex || 'Not Specified',
                minimumAge: protocolSection.eligibilityModule?.minimumAge || 'Not Specified',
                maximumAge: protocolSection.eligibilityModule?.maximumAge || 'Not Specified',
            };
        });

        // console.log(trials);

        // Push trials to Supabase trials table
        // Use bulk upsert instead of looping through each trial
        const formattedTrials = trials.map(trial => ({
            nctId: trial.nctId,
            title: trial.title,
            conditions: trial.conditions,
            condition_keywords: trial.conditionKeywords,
            phase: trial.phase,
            locations: trial.locations.map(location => location.facility + ', ' + location.country),
            startDate: trial.startDate,
            status: trial.status,
            num_participants: trial.participants,
            description: trial.description,
            eligibilityCriteria: trial.eligibilityCriteria,
            sex: trial.sex,
            minimumAge: trial.minimumAge,
            maximumAge: trial.maximumAge
        }));

        const { data, error } = await supabase
            .from('trials')
            .upsert(formattedTrials, { 
                onConflict: 'id',
                ignoreDuplicates: false
            }
        );
        console.log(data)

        if (error) {
            console.error('Error inserting trials:', error);
        } else {
            console.log(`Successfully processed ${formattedTrials.length} trials`);
        }

        // console.log("Processed trials:", trials);

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}