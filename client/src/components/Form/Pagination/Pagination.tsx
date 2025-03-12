import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../../../assets/images/left-arrow-pagination.png";
import rightArrow from "../../../assets/images/right-arrow-pagination.png";

const Pagination = ({ totalPages = 4 }) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = Number(page) || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/admin/form/${page}`);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        type="button"
        className="mb-3 disabled:opacity-50"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img src={leftArrow} alt="left-arrow" className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={`mb-3 rounded-full border px-2 font-semibold ${
              currentPage === pageNumber
                ? "bg-yellow-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => goToPage(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        className="mb-3 disabled:opacity-50"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img src={rightArrow} alt="right-arrow" className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
