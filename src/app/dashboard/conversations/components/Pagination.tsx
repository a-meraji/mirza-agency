import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationState } from '../models/types';

interface PaginationProps extends PaginationState {
  hasFaSubdomain: boolean;
  totalCount: number;
}

export default function Pagination({ 
  page, 
  limit, 
  skip, 
  search,
  totalPages,
  hasFaSubdomain,
  totalCount
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4 bg-white px-4 py-3 sm:px-6 shadow rounded-md">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          {hasFaSubdomain ? (
            <>
              نمایش <span className="font-medium">{skip + 1}</span> تا{' '}
              <span className="font-medium">{Math.min(skip + limit, totalCount)}</span> از{' '}
              <span className="font-medium">{totalCount}</span> مکالمه
            </>
          ) : (
            <>
              Showing <span className="font-medium">{skip + 1}</span> to{' '}
              <span className="font-medium">{Math.min(skip + limit, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount}</span> conversations
            </>
          )}
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end gap-2">
        {page > 1 && (
          <Link
            href={`/dashboard/conversations?page=${page - 1}&limit=${limit}${search ? `&search=${search}` : ''}`}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {hasFaSubdomain ? (
              <>
                قبلی
                <ChevronRight className="h-4 w-4 mr-1" />
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </>
            )}
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={`/dashboard/conversations?page=${page + 1}&limit=${limit}${search ? `&search=${search}` : ''}`}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {hasFaSubdomain ? (
              <>
                <ChevronLeft className="h-4 w-4 ml-1" />
                بعدی
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Link>
        )}
      </div>
    </div>
  );
} 