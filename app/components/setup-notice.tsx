export function SetupNotice({
  title = "Database setup required",
  message,
}: {
  title?: string;
  message: string;
}) {
  const followUp =
    message.includes("Missing MONGODB_URI") || message.includes("sample Atlas host")
      ? (
          <>
            Update <code>.env</code> or <code>.env.local</code> with the real MongoDB Atlas connection
            string, then restart the dev server.
          </>
        )
      : message.includes("Could not connect to any servers")
        ? (
            <>
              Check your MongoDB Atlas Network Access settings and allow the current client IP or the
              required deployment traffic, then restart the dev server.
            </>
          )
        : (
            <>
              Check the MongoDB Atlas connection string, database user credentials, and Network Access
              settings, then restart the dev server.
            </>
          );

  return (
    <section className="page-section">
      <div className="empty-state setup-notice">
        <h2>{title}</h2>
        <p>{message}</p>
        <p className="muted">{followUp}</p>
      </div>
    </section>
  );
}
