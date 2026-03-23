import { useState, useEffect, useCallback } from 'react';

export interface FilterState {
    status: string[];
    priority: string[];
    assignee: string[];
    dateFrom: string;
    dateTo: string;
}

export const useUrlFilters = () => {
    const getFiltersFromUrl = (): FilterState => {
        const searchParams = new URLSearchParams(window.location.search);
        return {
            status: searchParams.getAll('status'),
            priority: searchParams.getAll('priority'),
            assignee: searchParams.getAll('assignee'),
            dateFrom: searchParams.get('dateFrom') || '',
            dateTo: searchParams.get('dateTo') || '',
        };
    };

    const [filters, setFiltersState] = useState<FilterState>(getFiltersFromUrl());

    useEffect(() => {
        const handlePopState = () => {
            setFiltersState(getFiltersFromUrl());
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
        setFiltersState((prev) => {
            const updated = { ...prev, ...newFilters };
            const searchParams = new URLSearchParams();

            // Append arrays properly
            Object.entries(updated).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => searchParams.append(key, v));
                } else if (value) {
                    searchParams.set(key, value as string);
                }
            });

            const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
            window.history.pushState(null, '', newUrl);

            return updated;
        });
    }, []);

    const clearFilters = useCallback(() => {
        window.history.pushState(null, '', window.location.pathname);
        setFiltersState({ status: [], priority: [], assignee: [], dateFrom: '', dateTo: '' });
    }, []);

    return { filters, updateFilters, clearFilters };
};