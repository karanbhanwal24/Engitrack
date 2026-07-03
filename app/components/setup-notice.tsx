export function SetupNotice({
  title = "Database setup required",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <section className="page-section">
      <div className="empty-state setup-notice">
        <h2>{title}</h2>
        <p>{message}</p>
        <p className="muted">
          Update <code>.env</code> or <code>.env.local</code> with the real MongoDB Atlas connection string,
          then restart the dev server.
        </p>
      </div>
    </section>
  );
}
