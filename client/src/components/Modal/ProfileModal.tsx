// React Cropper
import "cropperjs/dist/cropper.css";
import Cropper, { ReactCropperElement } from "react-cropper";

// Hooks
import { useRef } from "react";

// Assets
import close from "../../assets/images/close.png";
import checkered from "../../assets/images/checkered.png";
import { useState, createRef } from "react";

const cropperStyle = {
  height: 400,
  width: 400,
  backgroundImage: `url(${checkered})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  border: "1px solid black",
};

type ProfileModalProps = {
  status: boolean;
  toggleStatus: () => void;
  handleChangeProfile: (file: File) => void;
};

const ProfileModal = ({
  status,
  toggleStatus,
  handleChangeProfile,
}: ProfileModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState("");
  const cropperRef = createRef<ReactCropperElement>();

  const handleFileClick = () => {
    fileRef.current?.click(); // Triggers the hidden file input
  };

  const handleFileChange = () => {
    if (fileRef.current?.files?.[0]) {
      const file = fileRef.current.files[0];
      setProfile(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!cropperRef.current?.cropper || !fileRef.current?.files?.[0]) return;

    const cropper = cropperRef.current.cropper;

    // Get the cropped canvas
    const canvas = cropper.getCroppedCanvas({
      width: 200,
      height: 200,
      fillColor: "#fff",
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob || !fileRef.current?.files?.[0]) return;

        // Create a new File object with the cropped image
        const croppedFile = new File([blob], fileRef.current.files[0].name, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });

        setProfile("");
        toggleStatus();
        handleChangeProfile(croppedFile);
      },
      "image/jpeg",
      0.95,
    ); // 0.95 is the quality (0-1)
  };

  if (!status) {
    return;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/50">
      <div className="relative rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={toggleStatus}
          type="button"
          className="absolute top-2 right-2 w-8"
        >
          <img src={close} alt="Close Button" />
        </button>

        <div className="mt-7 flex flex-col">
          <Cropper
            ref={cropperRef}
            style={cropperStyle}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            src={profile}
            viewMode={1}
            cropBoxResizable={true}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            guides={true}
            zoomable={false}
          />
          <button
            type="button"
            onClick={handleFileClick}
            className="mx-auto mt-2 cursor-pointer border-2 bg-blue-600 px-2 py-1 font-bold text-slate-100 drop-shadow-lg hover:bg-blue-500 disabled:cursor-auto disabled:bg-slate-500 disabled:hover:bg-none"
          >
            UPLOAD PROFILE
          </button>
          <button
            type="button"
            disabled={profile ? false : true}
            onClick={handleSubmit}
            className="mx-auto mt-2 cursor-pointer border-2 bg-blue-600 px-2 py-1 font-bold text-slate-100 drop-shadow-lg hover:bg-blue-500 disabled:cursor-auto disabled:bg-slate-500 disabled:hover:bg-none"
          >
            SAVE
          </button>
          <input
            ref={fileRef}
            onChange={handleFileChange}
            title="Profile Upload"
            accept="image/*"
            type="file"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
