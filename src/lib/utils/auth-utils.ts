interface SponsorData {
    organization_number: string;
    scheme_name: string;
    cost_center: string;
    cost_center_description: string;
    isDelegated?: boolean;
    originalRmEmail?: string | null;
}

export const refreshUserContext = async (newSponsorData: SponsorData) => {
    try {
        // Only handle sponsor-related data
        const sponsorData = {
            organization_number: newSponsorData.organization_number,
            scheme_name: newSponsorData.scheme_name,
            cost_center: newSponsorData.cost_center,
            cost_center_description: newSponsorData.cost_center_description,
            isDelegated: newSponsorData.isDelegated || false,
            originalRmEmail: newSponsorData.originalRmEmail || null,
        };

        // Set sponsor cookie
        const encodedSponsorData = encodeURIComponent(JSON.stringify(sponsorData));
        const cookieOptions = 'path=/; max-age=86400; SameSite=Strict';
        document.cookie = `currentSponsor=${encodedSponsorData}; ${cookieOptions}`;

        // Store state for reload
        localStorage.setItem('lastPath', window.location.pathname);
        localStorage.setItem('lastSponsor', JSON.stringify(sponsorData));

        return sponsorData;
    } catch (error) {
        console.error('Error updating sponsor context:', error);
        throw error;
    }
};
