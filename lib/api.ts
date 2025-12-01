const json = await res.json();
return json.success ? json.data : [];
    },

getBranch: async (id: string) => {
    const res = await fetch(`${API_URL}/api/branches/${id}`);
    return res.json();
},

    // Reviews
    getReviews: async (branchId?: string, limit: number = 10) => {
        const url = branchId
            ? `${API_URL}/api/reviews?branchId=${branchId}&limit=${limit}`
            : `${API_URL}/api/reviews?limit=${limit}`;
        const res = await fetch(url);
        return res.json();
    },

        submitReview: async (reviewData: any) => {
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.error || 'Failed to submit review');
            }
            return json.data;
        },

            // Menus
            getMenus: async (category?: string, branchId?: string) => {
                let url = `${API_URL}/api/menus`;
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (branchId) params.append('branchId', branchId);
                if (params.toString()) url += `?${params.toString()}`;

                const res = await fetch(url);
                return res.json();
            }
};
