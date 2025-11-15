📅 Calendar View Component

A fully custom React + TypeScript Calendar Component built with Month View, Week View, event creation/edit/delete, keyboard accessibility, and Storybook documentation — without using any pre-built calendar libraries.

🚀 Live Storybook

🔗 Deployed Storybook URL: [Add your deployed link here]

📦 Installation
npm install
npm run storybook


To build the project:

npm run build

🏗️ Architecture

The project follows a clean and scalable folder structure:
calendar-component/
│
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
│
├── index.html
│
└── src/
    ├── main.tsx
    ├── App.tsx
    │
    ├── styles/
    │   └── globals.css
    │
    ├── utils/
    │   ├── date.utils.ts
    │   └── event.utils.ts
    │
    ├── hooks/
    │   ├── useDarkMode.ts
    │   ├── useEventManager.ts
    │   └── useCalendar.ts   
    │
    ├── components/
    │   ├── ResponsiveWrapper.tsx
    │   │
    │   ├── primitives/
    │   │   ├── Button.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Select.tsx
    │   │
    │   └── calendar/
    │       ├── CalendarView.tsx
    │       ├── CalendarView.types.ts
    │       ├── CalendarHeader.tsx
    │       ├── CalendarCell.tsx
    │       ├── MonthView.tsx
    │       ├── WeekView.tsx
    │       ├── EventForm.tsx
    │       └── CalendarView.stories.tsx


Architecture Highlights

Fully modular components

Strong TypeScript types (no any)

Reusable utility functions for date calculations and event handling

Clear separation of presentation vs. logic

Storybook used for isolated UI development

✨ Features
✔ Core Features

 Month View (42-cell grid)

 Week View (hourly time slots)

 Add events

 Edit events

 Delete events

 Hover previews (Month + Week)

 Responsive design (mobile → desktop)

 Switch views (Month ↔ Week)

 Navigation (Prev / Next / Today)

 Keyboard navigation

 Fully accessible (ARIA roles, focus states)

✔ Optional Features You Added

 Large dataset support

 Dynamic event coloring

 Smooth UI interactions

🧪 Storybook Stories

Your Storybook includes:

Default View

Empty State

Large Dataset View

Event Interaction Demo

Month View Demo

Week View Demo

Event Editing Story

Accessibility Story

Helps reviewers test every feature independently.

🛠️ Technologies

React (Functional Components + Hooks)

TypeScript (strict mode, full typings)

Tailwind CSS

Storybook v7+

Vite / Webpack (depending on your setup)

♿ Accessibility

Your component includes:

Keyboard navigation for all controls

Visible focus indicators

ARIA labels and roles

Fully usable without a mouse

Screen-reader readable navigation buttons

📄 Contact

Sahad Shaikh
📧 [sahadshaikh877@gmail.com]
"# calendar-component" 
