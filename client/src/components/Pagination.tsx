import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../assets/images/left-arrow-pagination.png";
import rightArrow from "../assets/images/right-arrow-pagination.png";

const Pagination = ({ totalPages = 4 }) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = Number(page) || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/form/${page}`);
    }
  };

  return (
    <div className="flex items-center space-x-2 justify-center mt-4">
      {/* Previous Button */}
      <button
        className="mb-3 disabled:opacity-50"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img src={leftArrow} alt="left-arrow" className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={`px-2 border rounded-full font-semibold mb-3 ${
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
        className="mb-3 disabled:opacity-50"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img src={rightArrow} alt="right-arrow" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
