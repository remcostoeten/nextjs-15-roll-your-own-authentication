---
title: Dark Auth UI Components
description: Documentation for the dark authentication UI components inspired by Vercel
---

# Dark Auth UI Components

This document outlines the dark-themed authentication components used across the application, inspired by Vercel's sleek and modern design system.

## Design Principles

- **Minimal and Clean**: Simple, focused UI with excellent typography and spacing
- **Dark Background**: Deep, dark backgrounds with contrasting text and elements
- **Blue Accents**: Primary blue color (#2E71E5) for buttons and interactive elements
- **Subtle Depth**: Subtle shadows and borders to create depth without being distracting
- **Responsive**: Components adapt seamlessly to mobile and desktop views

## Components

### Layout

The authentication layout uses a dark background (#0a0a0a) with centered content and provides a consistent backdrop for all auth pages.

```tsx
<div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white">
	<div className="w-full max-w-[500px] px-8">{/* Content goes here */}</div>
</div>
```

### Logo Container

The logo container displays a circular blue logo at the top of each auth page.

```tsx
<div className="mb-8 flex justify-center">
	<div className="h-12 w-12 rounded-full bg-[#2E71E5] flex items-center justify-center">
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke="currentColor"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{/* Icon path goes here */}
		</svg>
	</div>
</div>
```

### Title Section

The title section includes a main heading and optional subtitle text.

```tsx
<div className="mb-8 text-center">
	<h1 className="mb-2 text-3xl font-bold">Page Title</h1>
	<p className="text-sm text-gray-400">
		Subtitle text with optional{' '}
		<a
			href="#"
			className="text-[#2E71E5] hover:underline"
		>
			link
		</a>
	</p>
</div>
```

### Form Inputs

Form inputs use a dark background with blue focus ring and appropriate validation styles.

```tsx
<div className="mb-5">
	<label
		htmlFor="inputId"
		className="mb-2 block text-sm font-medium text-gray-200"
	>
		Label Text
	</label>
	<input
		id="inputId"
		name="inputName"
		type="text"
		placeholder="Placeholder text"
		value={value}
		onChange={handleChange}
		className={`w-full rounded-md border bg-[#111111] px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] ${
			error ? 'border-red-500' : 'border-gray-700'
		}`}
		required
	/>
	{error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
</div>
```

### Buttons

Primary buttons use the blue accent color with appropriate hover and focus states.

```tsx
<button
	type="submit"
	className="w-full rounded-md bg-[#2E71E5] py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-[#2E71E5]/90 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
	disabled={isLoading}
>
	{isLoading ? (
		<>
			<LoadingSpinner />
			<span>Processing...</span>
		</>
	) : (
		<span>Button Text &rarr;</span>
	)}
</button>
```

### Loading Spinner

The loading spinner is used inside buttons to indicate processing.

```tsx
<svg
	className="mr-2 h-4 w-4 animate-spin text-current"
	fill="none"
	viewBox="0 0 24 24"
>
	<circle
		className="opacity-25"
		cx="12"
		cy="12"
		r="10"
		stroke="currentColor"
		strokeWidth="4"
	/>
	<path
		className="opacity-75"
		d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		fill="currentColor"
	/>
</svg>
```

### Social Login Divider

The divider creates a visual separation between the main form and social login options.

```tsx
<div className="mt-8">
	<div className="relative">
		<div className="absolute inset-0 flex items-center">
			<div className="w-full border-t border-gray-800"></div>
		</div>
		<div className="relative flex justify-center text-xs">
			<span className="bg-[#0a0a0a] px-2 text-gray-500 uppercase">
				Or continue with
			</span>
		</div>
	</div>
</div>
```

### Social Login Buttons

Social login buttons are displayed in a grid layout with icons and minimal styling.

```tsx
<div className="mt-6 grid grid-cols-3 gap-3">
	<button
		type="button"
		className="inline-flex w-full justify-center rounded-md border border-gray-800 bg-[#111111] py-2 px-3 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E71E5] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
	>
		<svg
			className="h-5 w-5"
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			{/* SVG path goes here */}
		</svg>
	</button>
	{/* Additional social buttons */}
</div>
```

### Error Message

Error messages are displayed with a subtle red background and border.

```tsx
<div className="mb-6 rounded-md bg-red-900/20 p-3 text-sm text-red-500 border border-red-900/50">
	Error message goes here
</div>
```

### Success Message

Success messages use a blue-tinted background with a border.

```tsx
<div className="rounded-md bg-[#172a45]/30 p-4 text-sm text-[#2E71E5] border border-[#2E71E5]/20">
	<div className="mb-2 font-medium">Success Title</div>
	<p className="mb-4">Success message details go here.</p>
</div>
```

## Usage Guidelines

1. **Consistency**: Maintain the same styling patterns across all authentication pages
2. **Error Handling**: Always provide clear error messages for validation issues
3. **Accessibility**: Ensure proper contrast and focus states for all interactive elements
4. **Responsive Design**: Test all components on various screen sizes

## Implementation Example

See the following pages for implementation examples:

- Login page: `src/app/(auth)/login/page.tsx`
- Register page: `src/app/(auth)/register/page.tsx`
