import { describe, expect, it } from 'vitest';
import { filterBrowseResults, type BrowseResult } from './search-browse';
const rows = [
  { id: 'lake', category: 'waterway', searchText: 'Lake Harriet HARRIET LAKE geonames' },
  { id: 'road', category: 'street', searchText: 'Harriet Avenue overture' },
] as BrowseResult[];
describe('browse filters', () => {
  it('starts with every result in the host order', () => expect(filterBrowseResults(rows, '', 'all')).toEqual(rows));
  it('combines case-insensitive keyword terms with category', () => {
    expect(filterBrowseResults(rows, ' HARRIET ', 'street')).toEqual([rows[1]]);
    expect(filterBrowseResults(rows, 'harriet lake', 'all')).toEqual([rows[0]]);
    expect(filterBrowseResults(rows, 'lake', 'street')).toEqual([]);
    expect(filterBrowseResults(rows, 'absent', 'all')).toEqual([]);
  });
});
