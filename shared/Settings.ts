export interface FeedSettingsInterface {
    uid: string,
    gender_filter:  "male"|"female"|"any";
    looking_for: "relationship"|"friendship"|"any";
    personality_filter: number[]
    age_range: {
        min: number;
        max: number;
    }
    show_your_dates: boolean;
}