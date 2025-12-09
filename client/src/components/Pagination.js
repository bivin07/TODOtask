import React from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5; 

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="First page"
      >
        <FaAngleDoubleLeft className="w-4 h-4" />
      </button>

      
      {startPage > 1 && (
        <span className="px-3 py-1 text-gray-500">...</span>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-md ${
            currentPage === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <span className="px-3 py-1 text-gray-500">...</span>
      )}

      
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Last page"
      >
        <FaAngleDoubleRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;