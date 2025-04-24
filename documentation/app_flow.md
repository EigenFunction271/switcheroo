Initial Load
App defaults to isDay = true

Background is sky blue (bg-sky-200)

Text: “Good Morning!”

Toggle switch shows a yellow sun icon

On Toggle Click
isDay flips

Tailwind classes dynamically update:

Background to bg-gray-900

Text to white

Switch circle slides right and swaps SVG to moon

Message updates to “Good Night!”

All transitions animated via transition-all duration-1000

Responsive Behavior
Text, switch, and spacing scale using Tailwind’s w-screen, h-screen, text-3xl, md:text-4xl utilities