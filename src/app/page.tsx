/**
 * EchoSoul — Stage 0 Infrastructure Page
 *
 * This is a placeholder confirming the Next.js infrastructure is running.
 * The product UI begins at Stage 1.
 * Do NOT add product features to this file.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">EchoSoul</h1>
        <p className="text-sm text-gray-500">
          Infrastructure — Stage 0
        </p>
        <p className="text-xs text-gray-400">
          Product UI begins at Stage 1. See{" "}
          <code className="font-mono">docs/SETUP.md</code> for setup instructions.
        </p>
      </div>
    </main>
  );
}
