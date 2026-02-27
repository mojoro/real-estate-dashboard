'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="text-red-400 mb-2">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-red-400">Etwas ist schiefgelaufen</h2>
      <p className="text-gray-400 text-sm max-w-md text-center">
        {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <button
        onClick={reset}
        className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
