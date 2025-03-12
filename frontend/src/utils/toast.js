// src/utils/notify.js

import {toast} from "react-toastify";

// Default configuration options
const defaultOptions = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
};

// Main notification function that accepts type, message and custom options
export const notify = (type, message, options = {}) => {
	const finalOptions = {...defaultOptions, ...options};

	switch (type) {
		case "success":
			return toast.success(message, finalOptions);
		case "error":
			return toast.error(message, finalOptions);
		case "info":
			return toast.info(message, finalOptions);
		case "warning":
			return toast.warn(message, finalOptions);
		case "dark":
			return toast.dark(message, finalOptions);
		case "default":
			return toast(message, finalOptions);
		case "promise":
			return toast.promise(
				message.promise,
				{
					pending: message.pending || "Promise is pending...",
					success: message.success || "Promise resolved 👌",
					error: message.error || "Promise rejected 🤯",
				},
				finalOptions
			);
		default:
			return toast(message, finalOptions);
	}
};

// Helper functions for common toast types
export const showToast = {
	success: (message, options) => notify("success", message, options),
	error: (message, options) => notify("error", message, options),
	info: (message, options) => notify("info", message, options),
	warning: (message, options) => notify("warning", message, options),
	dark: (message, options) => notify("dark", message, options),
	default: (message, options) => notify("default", message, options),

	// Promise toast
	promise: (promiseObj, messages, options) =>
		notify(
			"promise",
			{
				promise: promiseObj,
				...messages,
			},
			options
		),

	// Update existing toast
	update: (toastId, options) => toast.update(toastId, options),

	// Dismiss toast
	dismiss: (toastId) => toast.dismiss(toastId),

	// Dismiss all toasts
	dismissAll: () => toast.dismiss(),

	// Custom positioning shortcuts
	topCenter: (message, type = "default", options = {}) =>
		notify(type, message, {...options, position: "top-center"}),

	bottomRight: (message, type = "default", options = {}) =>
		notify(type, message, {...options, position: "bottom-right"}),

	bottomCenter: (message, type = "default", options = {}) =>
		notify(type, message, {...options, position: "bottom-center"}),

	// Example of a custom styled toast
	customStyled: (message, options = {}) => {
		return toast(message, {
			...defaultOptions,
			...options,
			className: "custom-toast-class",
			bodyClassName: "custom-toast-body",
			progressClassName: "custom-progress-bar",
		});
	},
};

// Example usage:
// ---------------
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { notify, showToast } from './utils/notify';
//
// // Add in App.js
// <ToastContainer />
//
// // Usage in components:
// notify('success', 'Operation succeeded!');
// showToast.error('Something went wrong');
// showToast.topCenter('Center notification', 'info');
//
// // With promise:
// showToast.promise(
//   fetch('/api/data'),
//   {
//     pending: 'Loading data...',
//     success: 'Data loaded successfully!',
//     error: 'Error loading data'
//   }
// );
