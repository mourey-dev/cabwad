interface FilterBarProps {
  isActive: boolean;
  onActiveChange: (isActive: boolean) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const FilterBar = ({
  isActive,
  onActiveChange,
  category,
  onCategoryChange,
}: FilterBarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="mr-4 inline-block">
        <label className="inline-flex cursor-pointer items-center">
          <input
            onClick={() => onActiveChange(!isActive)}
            type="checkbox"
            className="peer sr-only"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          <span className="ms-3 text-sm font-medium text-blue-600">
            RESIGNED
          </span>
        </label>
      </div>
      <select
        title="employment_status"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded border-2 bg-white text-blue-600"
      >
        <option value="ALL">ALL</option>
        <option value="PERMANENT">PERMANENT</option>
        <option value="CASUAL">CASUAL</option>
        <option value="JOB ORDER">JOB ORDER</option>
        <option value="CO-TERMINUS">CO-TERMINUS</option>
        <option value="CONTRACT OF SERVICE">CONTRACT OF SERVICE</option>
        <option value="TEMPORARY">TEMPORARY</option>
      </select>
    </div>
  );
};

export default FilterBar;
