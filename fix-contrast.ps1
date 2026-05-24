$files = @(
  "c:\Users\LENOVO\spk-parfum\src\pages\Kriteria.jsx",
  "c:\Users\LENOVO\spk-parfum\src\pages\AHP.jsx",
  "c:\Users\LENOVO\spk-parfum\src\pages\TOPSIS.jsx",
  "c:\Users\LENOVO\spk-parfum\src\pages\Settings.jsx"
)

foreach ($f in $files) {
  $c = Get-Content $f -Raw

  # === FIX DARK TEXT ON DARK BG (too dark to read) ===
  # green-600 is too dark on slate-800 bg
  $c = $c -replace 'text-green-600', 'text-emerald-400'
  # blue-600 is too dark on slate-800 bg  
  $c = $c -replace 'text-blue-600', 'text-blue-400'
  # red-600 is borderline, make it brighter
  $c = $c -replace 'text-red-600', 'text-red-400'
  # purple-600 too dark
  $c = $c -replace 'text-purple-600', 'text-purple-400'
  # indigo-600 too dark
  $c = $c -replace 'text-indigo-600', 'text-blue-400'
  # amber-600 too dark
  $c = $c -replace 'text-amber-600', 'text-amber-400'
  # yellow-500 on dark is fine, but yellow-600 is too dark
  $c = $c -replace 'text-yellow-600', 'text-yellow-400'

  # === FIX STAT CARD VALUES - make them bright and readable ===
  # Ensure stat values pop on dark backgrounds
  $c = $c -replace 'text-2xl font-bold text-blue-400', 'text-2xl font-bold text-blue-400'
  $c = $c -replace 'text-2xl font-bold text-emerald-400', 'text-2xl font-bold text-emerald-400'

  # === FIX TABLE CELL TEXT ===
  # text-white on bg-slate-700/30 hover is fine
  # text-slate-300 for table body cells is good
  # Fix any remaining text-slate-300 that's on text-slate-300 bg
  $c = $c -replace 'font-semibold text-white bg-slate-700/30', 'font-semibold text-blue-300 bg-slate-700/30'

  # === FIX FORM SELECT OPTIONS (dropdown) - they need dark text on light native dropdown ===
  # Select options render natively with light bg, so option text should be dark
  # This is a known issue but CSS can't fix native select options easily

  # === FIX PROGRESS BAR TEXT ===
  $c = $c -replace 'text-sm font-semibold text-blue-400', 'text-sm font-semibold text-cyan-400'
  $c = $c -replace 'text-sm font-medium text-blue-400', 'text-sm font-medium text-cyan-400'
  $c = $c -replace 'text-sm font-medium text-emerald-400', 'text-sm font-medium text-emerald-400'

  # === FIX REMAINING bg-indigo patterns ===
  $c = $c -replace 'bg-indigo-50', 'bg-blue-900/20'
  $c = $c -replace 'bg-indigo-100', 'bg-blue-500/20'

  # === FIX REMAINING LIGHT BACKGROUND PATTERNS ===
  $c = $c -replace '"bg-emerald-50 ', '"bg-emerald-900/20 '
  $c = $c -replace '"bg-red-50 ', '"bg-red-900/20 '
  $c = $c -replace '"bg-amber-50 ', '"bg-amber-900/20 '
  $c = $c -replace '"bg-blue-50 ', '"bg-blue-900/20 '
  $c = $c -replace '"bg-violet-50 ', '"bg-violet-900/20 '

  # === FIX HOVER STATES WITH LIGHT BG ===
  $c = $c -replace 'hover:bg-blue-100', 'hover:bg-blue-500/30'
  $c = $c -replace 'hover:bg-red-100', 'hover:bg-red-500/30'
  $c = $c -replace 'hover:bg-emerald-100', 'hover:bg-emerald-500/30'
  $c = $c -replace 'hover:bg-indigo-100', 'hover:bg-blue-500/30'

  # === FIX white text that might clash with white/near-white elements ===
  # font-medium text-white on table cells - make it slightly different
  $c = $c -replace 'whitespace-nowrap text-sm text-white', 'whitespace-nowrap text-sm text-slate-300'

  # === FIX LINK/INTERACTIVE COLORS ===
  $c = $c -replace 'text-blue-700', 'text-blue-300'
  $c = $c -replace 'text-red-700', 'text-red-300'
  $c = $c -replace 'text-green-700', 'text-emerald-300'
  $c = $c -replace 'text-pink-700', 'text-pink-300'

  # === FIX REMAINING BORDER COLORS ===
  $c = $c -replace 'border-emerald-300', 'border-emerald-500/30'
  $c = $c -replace 'border-red-300', 'border-red-500/30'
  $c = $c -replace 'border-amber-300', 'border-amber-500/30'
  $c = $c -replace 'border-indigo-300', 'border-blue-500/30'

  # === FIX FONT COLOR FOR FORM OPTION TEXT (native select) ===
  # Add color scheme to help with native selects
  
  # === SETTINGS SPECIFIC: Tab text colors ===
  $c = $c -replace "text-slate-400 hover:bg-slate-700/30", 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
  
  # === FIX AHP TABLE COLORS: Make Indigo/Violet/Emerald/Amber table headers readable ===
  $c = $c -replace 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white', 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
  $c = $c -replace 'bg-violet-600 text-white', 'bg-violet-600 text-white'
  $c = $c -replace 'bg-emerald-600 text-white', 'bg-emerald-600 text-white'
  $c = $c -replace 'bg-amber-500 text-white', 'bg-amber-600 text-white'

  # === FIX CONSISTENCY RESULT TEXT ===
  $c = $c -replace "'text-emerald-400' : 'text-red-400'", "'text-emerald-400' : 'text-red-400'"
  
  # === FIX REMAINING LIGHT TEXT-BG COMBOS ===
  $c = $c -replace 'bg-green-100', 'bg-emerald-500/20'
  $c = $c -replace 'bg-red-100', 'bg-red-500/20'
  $c = $c -replace 'bg-blue-100', 'bg-blue-500/20'
  $c = $c -replace 'bg-yellow-100', 'bg-yellow-500/20'
  $c = $c -replace 'bg-pink-100', 'bg-pink-500/20'
  $c = $c -replace 'bg-purple-100', 'bg-purple-500/20'

  # === FIX LIGHT-MODE TEXT COLORS on badges ===
  $c = $c -replace 'text-green-800', 'text-emerald-300'
  $c = $c -replace 'text-red-800', 'text-red-300'
  $c = $c -replace 'text-blue-800', 'text-blue-300'
  $c = $c -replace 'text-yellow-800', 'text-yellow-300'
  $c = $c -replace 'text-pink-800', 'text-pink-300'
  $c = $c -replace 'text-purple-800', 'text-purple-300'

  Set-Content -Path $f -Value $c -NoNewline
  Write-Output "Fixed: $f"
}
