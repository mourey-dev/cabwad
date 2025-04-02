import back from "../../assets/images/back.png";

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => (
  <button
    onClick={onClick}
    className="hover:text-grey mb-4 flex items-center space-x-2 text-black"
  >
    <img
      src={back}
      alt="Back"
      className="h-5 w-5 transition-transform duration-300 hover:scale-120"
    />
    <span className="text-md font-medium">Back</span>
  </button>
);
