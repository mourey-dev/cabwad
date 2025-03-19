type ActionButtonProps = {
  onClick?: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
};

const ActionButton = ({
  label,
  className,
  onClick,
  disabled = false,
}: ActionButtonProps) => {
  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ActionButton;
