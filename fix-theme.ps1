$files = @(
  "c:\Users\LENOVO\spk-parfum\src\pages\Kriteria.jsx",
  "c:\Users\LENOVO\spk-parfum\src\pages\AHP.jsx",
  "c:\Users\LENOVO\spk-parfum\src\pages\TOPSIS.jsx",
  "c:\Users\LENOVO\spk-parfum\src\pages\Settings.jsx"
)

foreach ($f in $files) {
  $c = Get-Content $f -Raw

  # Outer wrapper
  $c = $c -replace 'min-h-screen bg-slate-50', 'p-8 relative z-10'
  $c = $c -replace 'min-h-screen bg-gray-50', 'p-8 relative z-10'

  # Card containers - specific patterns first
  $c = $c -replace 'bg-white p-6 rounded-xl shadow-sm border border-gray-200', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6'
  $c = $c -replace 'bg-white p-4 rounded-xl shadow-sm border border-gray-200', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4'
  $c = $c -replace 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden'
  $c = $c -replace 'bg-white rounded-xl shadow-sm border border-gray-200', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl'
  $c = $c -replace 'bg-white p-6 rounded-xl shadow-sm border border-slate-200', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6'
  $c = $c -replace 'bg-white p-4 rounded-xl shadow-sm border border-slate-200', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4'
  $c = $c -replace 'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden'
  $c = $c -replace 'bg-white rounded-xl shadow-sm border border-slate-200 p-6', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6'
  $c = $c -replace 'bg-white rounded-xl shadow-sm border border-slate-200', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl'
  $c = $c -replace 'bg-white rounded-xl shadow-sm border border-slate-200 p-12', 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12'

  # Headings
  $c = $c -replace 'text-3xl font-bold text-slate-900', 'text-4xl font-bold text-white'
  $c = $c -replace 'text-xl font-bold text-gray-900', 'text-xl font-bold text-white'
  $c = $c -replace 'text-xl font-bold text-slate-900', 'text-xl font-bold text-white'
  $c = $c -replace 'text-lg font-bold text-gray-900', 'text-lg font-bold text-white'
  $c = $c -replace 'text-lg font-bold text-slate-900', 'text-lg font-bold text-white'
  $c = $c -replace 'text-lg font-medium text-gray-900', 'text-lg font-medium text-white'
  $c = $c -replace 'text-lg font-semibold text-slate-800', 'text-lg font-semibold text-white'
  $c = $c -replace 'text-lg font-semibold text-emerald-800', 'text-lg font-semibold text-emerald-300'

  # Secondary text
  $c = $c -replace 'text-gray-600 mt-1', 'text-slate-400 mt-1'
  $c = $c -replace 'text-slate-600 mt-1', 'text-slate-400 mt-1'
  $c = $c -replace 'text-sm text-gray-600', 'text-sm text-slate-400'
  $c = $c -replace 'text-sm text-slate-600', 'text-sm text-slate-400'
  $c = $c -replace 'text-xs text-slate-500', 'text-xs text-slate-400'

  # Icon containers
  $c = $c -replace 'p-3 bg-indigo-100 rounded-xl', 'p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30'
  $c = $c -replace 'p-2 bg-indigo-100 rounded-lg', 'p-2 bg-blue-500/20 rounded-lg border border-blue-500/30'
  $c = $c -replace 'p-2 bg-blue-100 rounded-lg', 'p-2 bg-blue-500/20 rounded-lg border border-blue-500/30'
  $c = $c -replace 'p-2 bg-violet-100 rounded-lg', 'p-2 bg-violet-500/20 rounded-lg border border-violet-500/30'
  $c = $c -replace 'p-2 bg-emerald-100 rounded-lg', 'p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30'
  $c = $c -replace 'text-indigo-600', 'text-blue-400'

  # Table headers
  $c = $c -replace 'thead className="bg-gray-50"', 'thead className="bg-gradient-to-r from-blue-950 to-purple-950"'
  $c = $c -replace 'text-xs font-semibold text-gray-600 uppercase', 'text-xs font-semibold text-white uppercase'

  # Table rows and cells
  $c = $c -replace 'divide-y divide-gray-200', 'divide-y divide-slate-700/50'
  $c = $c -replace 'divide-y divide-slate-100', 'divide-y divide-slate-700/50'
  $c = $c -replace 'hover:bg-gray-50', 'hover:bg-slate-700/30'
  $c = $c -replace 'text-sm text-gray-900', 'text-sm text-slate-300'
  $c = $c -replace 'text-sm font-medium text-gray-900', 'text-sm font-medium text-white'

  # Bg variations
  $c = $c -replace 'bg-gray-50 p-4 rounded-lg', 'bg-slate-700/50 p-4 rounded-xl'
  $c = $c -replace 'bg-gray-50 rounded-lg', 'bg-slate-700/50 rounded-xl'
  $c = $c -replace 'bg-slate-50 rounded-lg', 'bg-slate-700/50 rounded-xl'
  $c = $c -replace 'bg-gray-50 rounded-xl p-6 border border-gray-200', 'bg-slate-700/50 rounded-xl p-6 border border-slate-700/50'
  $c = $c -replace 'bg-slate-50 p-4 rounded-xl border border-slate-200', 'bg-slate-700/50 p-4 rounded-xl border border-slate-700/50'

  # Form labels
  $c = $c -replace 'text-sm font-semibold text-gray-700', 'text-sm font-semibold text-slate-300'
  $c = $c -replace 'text-sm font-semibold text-slate-700', 'text-sm font-semibold text-slate-300'

  # Form inputs
  $c = $c -replace 'border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent', 'bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80'

  # Cancel button
  $c = $c -replace 'bg-gray-500 text-white', 'bg-slate-700 text-white'
  $c = $c -replace 'hover:bg-gray-600', 'hover:bg-slate-600'

  # Action buttons
  $c = $c -replace 'bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100', 'bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-500/30 hover:bg-blue-500/30'
  $c = $c -replace 'bg-red-50 text-red-700 px-3 py-1 rounded-lg hover:bg-red-100', 'bg-red-500/20 text-red-300 px-3 py-1 rounded-lg border border-red-500/30 hover:bg-red-500/30'

  # Loading spinner
  $c = $c -replace 'border-b-2 border-purple-600', 'border-4 border-slate-600 border-t-blue-500'
  $c = $c -replace 'border-b-2 border-indigo-600', 'border-4 border-slate-600 border-t-blue-500'
  $c = $c -replace 'border-b-2 border-white', 'border-2 border-white/30 border-t-white'
  $c = $c -replace 'ml-3 text-gray-600', 'ml-3 text-slate-400'

  # Progress bars
  $c = $c -replace 'bg-gray-200 rounded-full', 'bg-slate-700 rounded-full'
  $c = $c -replace 'bg-slate-200 rounded-full', 'bg-slate-700 rounded-full'

  # Badge colors
  $c = $c -replace 'bg-green-100 text-green-800', 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
  $c = $c -replace 'bg-red-100 text-red-800', 'bg-red-500/20 text-red-300 border border-red-500/30'
  $c = $c -replace 'bg-emerald-100 text-emerald-700', 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
  $c = $c -replace 'bg-red-100 text-red-700', 'bg-red-500/20 text-red-300 border border-red-500/30'
  $c = $c -replace 'bg-blue-100 text-blue-800', 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
  $c = $c -replace 'bg-pink-100 text-pink-800', 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
  $c = $c -replace 'bg-purple-100 text-purple-800', 'bg-purple-500/20 text-purple-300 border border-purple-500/30'

  # AHP specific light backgrounds
  $c = $c -replace 'bg-indigo-50/30', 'bg-slate-700/30'
  $c = $c -replace "bg-indigo-50 font-bold text-indigo-700", 'bg-blue-900/30 font-bold text-blue-300'
  $c = $c -replace 'bg-indigo-100/60', 'bg-blue-900/40'
  $c = $c -replace 'hover:bg-indigo-50/50', 'hover:bg-slate-700/30'
  $c = $c -replace 'bg-violet-50/30', 'bg-slate-700/30'
  $c = $c -replace 'hover:bg-violet-50/50', 'hover:bg-slate-700/30'
  $c = $c -replace 'bg-violet-50', 'bg-violet-900/30'
  $c = $c -replace 'hover:bg-emerald-50/50', 'hover:bg-slate-700/30'
  $c = $c -replace 'bg-emerald-50 font-bold', 'bg-emerald-900/30 font-bold'
  $c = $c -replace 'bg-emerald-50 border border-emerald-200', 'bg-emerald-900/20 border border-emerald-500/30'
  $c = $c -replace 'bg-emerald-100 rounded-full', 'bg-emerald-500/20 rounded-full'
  $c = $c -replace 'hover:bg-amber-50/50', 'hover:bg-slate-700/30'

  # AHP text colors
  $c = $c -replace 'text-emerald-800', 'text-emerald-300'
  $c = $c -replace 'text-emerald-700', 'text-emerald-400'
  $c = $c -replace 'text-emerald-600', 'text-emerald-400'
  $c = $c -replace 'text-amber-700', 'text-amber-400'
  $c = $c -replace 'text-indigo-700', 'text-blue-300'
  $c = $c -replace 'text-violet-700', 'text-violet-300'
  $c = $c -replace 'text-violet-600', 'text-violet-400'

  # Primary buttons
  $c = $c -replace 'bg-indigo-600 text-white', 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
  $c = $c -replace 'hover:bg-indigo-700', 'hover:shadow-lg hover:shadow-blue-500/25'
  $c = $c -replace 'shadow-lg shadow-indigo-500/25', 'shadow-lg shadow-blue-500/25'
  $c = $c -replace 'hover:bg-emerald-700', 'hover:shadow-lg hover:shadow-emerald-500/25'
  $c = $c -replace 'shadow-lg shadow-emerald-500/25', 'shadow-lg shadow-emerald-500/25'

  # Remaining border fixes
  $c = $c -replace 'border-gray-200', 'border-slate-700/50'
  $c = $c -replace 'border-slate-200', 'border-slate-700/50'
  $c = $c -replace 'border border-slate-300', 'border border-slate-700/50'

  # Remaining bg-white
  $c = $c -replace 'bg-white', 'bg-slate-800/50'

  # Remaining text color fixes (careful ordering)
  $c = $c -replace 'text-gray-900', 'text-white'
  $c = $c -replace 'text-slate-900', 'text-white'
  $c = $c -replace 'text-slate-800', 'text-white'
  $c = $c -replace 'text-gray-700', 'text-slate-300'
  $c = $c -replace 'text-slate-700', 'text-slate-300'
  $c = $c -replace 'text-gray-600', 'text-slate-400'
  $c = $c -replace 'text-slate-600', 'text-slate-400'
  $c = $c -replace 'text-gray-500', 'text-slate-500'
  $c = $c -replace 'text-gray-400', 'text-slate-500'

  # Remaining bg-gray/slate-50
  $c = $c -replace '"bg-gray-50"', '"bg-slate-700/50"'
  $c = $c -replace '"bg-slate-50"', '"bg-slate-700/50"'
  $c = $c -replace 'bg-gray-50 ', 'bg-slate-700/50 '
  $c = $c -replace 'bg-slate-50 ', 'bg-slate-700/50 '

  # Toast position
  $c = $c -replace 'fixed bottom-4 right-4 z-50', 'fixed top-4 right-4 space-y-3 z-50'

  # Consistency ratio colors in AHP
  $c = $c -replace "bg-emerald-50 border-emerald-300", 'bg-emerald-900/20 border-emerald-500/30'
  $c = $c -replace "bg-red-50 border-red-300", 'bg-red-900/20 border-red-500/30'
  $c = $c -replace 'text-red-600', 'text-red-400'

  # Settings specific tab styles
  $c = $c -replace "hover:bg-gray-50", 'hover:bg-slate-700/30'

  Set-Content -Path $f -Value $c -NoNewline
  Write-Output "Updated: $f"
}
