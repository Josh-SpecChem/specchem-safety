import React from 'react';
import { Button } from '@/components/ui/button';
import { FormatUtils } from '../utils/format-utils';

export interface AdminPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    offset: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
}

export function AdminPagination({
  pagination,
  onPageChange,
  onLimitChange,
  className = ''
}: AdminPaginationProps) {
  const { page, limit, total, totalPages, offset } = pagination;
  
  const startItem = Math.min(offset + 1, total);
  const endItem = Math.min(offset + limit, total);
  
  const pageNumbers = React.useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [page, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Showing {FormatUtils.formatNumber(startItem)} to {FormatUtils.formatNumber(endItem)} of {FormatUtils.formatNumber(total)} results
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Limit selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        
        {/* Page navigation */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={pageNum === page ? "bg-blue-600 text-white" : ""}
            >
              {pageNum}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
