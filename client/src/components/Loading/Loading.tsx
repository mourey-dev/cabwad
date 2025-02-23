import LoadingVideo from "../../assets/images/cabwad-loading.mp4";

interface LoadingModalProps {
  loading: boolean;

  duration: number;

  onClose: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  loading,
  duration,
  onClose,
}) => {
  if (!loading) return null;

  return (
    <div className="bg-background-blue fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center rounded-lg p-5 shadow-lg">
        <video
          autoPlay
          muted
          loop
          className="h-auto w-[100%] max-w-[800px] object-contain"
        >
          <source src={LoadingVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default LoadingModal;
