import React from "react";

const Pagination = ({ totalPages, paginate }) => {
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => paginate(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
