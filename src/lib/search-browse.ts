import type { ContentSearchAnnotation } from './content-search';

export type BrowseResult = {
  id: string;
  label: string;
  category: string;
  categoryLabel: string;
  description: string;
  sources: string[];
  badges?: { key: string; label: string; symbol: string; name: string; id: string; href: string }[];
  searchText: string;
  annotations: ContentSearchAnnotation[];
};

// The host supplies Wherehence's canonical category order and result ranking.
export function filterBrowseResults(results: BrowseResult[], query: string, category: string): BrowseResult[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return results.filter(result => (category === 'all' || result.category === category) && terms.every(term => result.searchText.toLocaleLowerCase().includes(term)));
}
