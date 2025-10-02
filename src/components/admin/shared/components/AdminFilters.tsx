import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export interface AdminFiltersProps {
  fields: FilterField[];
  filters: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  filterCount: number;
  className?: string;
}

export function AdminFilters({
  fields,
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  filterCount,
  className = ''
}: AdminFiltersProps) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filterCount} filter{filterCount > 1 ? 's' : ''} active
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fields.map((field) => (
          <div key={field.key} className={field.className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            
            {field.type === 'text' && (
              <Input
                type="text"
                value={String(filters[field.key] || '')}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full"
              />
            )}
            
            {field.type === 'number' && (
              <Input
                type="number"
                value={String(filters[field.key] || '')}
                onChange={(e) => onFilterChange(field.key, parseInt(e.target.value) || 0)}
                placeholder={field.placeholder}
                className="w-full"
              />
            )}
            
            {field.type === 'select' && (
              <select
                value={String(filters[field.key] || '')}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {field.type === 'date' && (
              <Input
                type="date"
                value={String(filters[field.key] || '')}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
                className="w-full"
              />
            )}
            
            {field.type === 'boolean' && (
              <select
                value={filters[field.key] === undefined ? '' : filters[field.key] ? 'true' : 'false'}
                onChange={(e) => onFilterChange(field.key, e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
