export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full"
        style={{
          borderWidth: "4px",
          borderStyle: "solid",
          borderColor: "#e0e0e0",
          borderTopColor: "#0066cc",
        }}
      />
    </div>
  );
}
