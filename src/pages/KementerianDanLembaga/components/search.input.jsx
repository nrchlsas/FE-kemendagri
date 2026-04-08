export default function SearchInput({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Cari data...",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder={placeholder}
          aria-label="Search"
          value={value}
          onChange={onChange}
        />
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-search me-1" /> Cari
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={onClear}
            title="Reset"
          >
            <i className="bi bi-x-lg me-1" />
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
