import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface PollOption {
    title: string;
    color?: string;
    icon?: string;
    description?: string;
}

interface PollFormData {
    title: string;
    description: string;
    type: 'yes_no' | 'multiple_choice' | 'ranking' | 'custom_input';
    allow_multiple: boolean;
    allow_custom: boolean;
    show_results_without_voting: boolean;
    is_active: boolean;
    options: PollOption[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Poll Manager',
        href: '/dashboard/polls',
    },
    {
        title: 'Create Poll',
        href: '/dashboard/polls/create',
    },
];

// Available color options for poll options
const colorOptions = [
    { name: 'Default', value: null },
    { name: 'Purple', value: '#8847BB' },
    { name: 'Blue', value: '#4285F4' },
    { name: 'Teal', value: '#0F9D58' },
    { name: 'Green', value: '#34A853' },
    { name: 'Yellow', value: '#FBBC05' },
    { name: 'Orange', value: '#FF6D01' },
    { name: 'Red', value: '#EA4335' },
    { name: 'Pink', value: '#E83E8C' },
];

// Available icon options for poll options
const iconOptions = [
    { name: 'None', value: null },
    { name: 'Thumbs Up', value: 'thumbs-up' },
    { name: 'Thumbs Down', value: 'thumbs-down' },
    { name: 'Star', value: 'star' },
    { name: 'Heart', value: 'heart' },
    { name: 'Check', value: 'check' },
    { name: 'X', value: 'x' },
    { name: 'Question', value: 'question' },
    { name: 'Exclamation', value: 'exclamation' },
];

export default function CreatePoll() {
    const [formData, setFormData] = useState<PollFormData>({
        title: '',
        description: '',
        type: 'multiple_choice',
        allow_multiple: false,
        allow_custom: false,
        show_results_without_voting: false,
        is_active: true,
        options: [
            { title: '', color: undefined, icon: undefined, description: '' },
            { title: '', color: undefined, icon: undefined, description: '' },
        ],
    });

    const updateFormData = (field: keyof PollFormData, value: PollFormData[keyof PollFormData]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateOption = (index: number, field: keyof PollOption, value: PollOption[keyof PollOption]) => {
        const newOptions = [...formData.options];
        newOptions[index] = {
            ...newOptions[index],
            [field]: value,
        };
        updateFormData('options', newOptions);
    };

    const addOption = () => {
        updateFormData('options', [...formData.options, { title: '', color: undefined, icon: undefined, description: '' }]);
    };

    const removeOption = (index: number) => {
        if (formData.options.length <= 2) {
            alert('A poll must have at least 2 options.');
            return;
        }

        const newOptions = [...formData.options];
        newOptions.splice(index, 1);
        updateFormData('options', newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // For Yes/No type, override options
        if (formData.type === 'yes_no') {
            formData.options = [
                { title: 'Yes', color: '#34A853', icon: 'thumbs-up' },
                { title: 'No', color: '#EA4335', icon: 'thumbs-down' },
            ];
        }

        router.post(route('polls.store'), formData);
    };

    const renderIconPreview = (iconName: string) => {
        switch (iconName) {
            case 'thumbs-up':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                );
            case 'thumbs-down':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                );
            case 'star':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            case 'heart':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'check':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'x':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'question':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'exclamation':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    // Preview component to show how the poll will look
    const PollPreview = () => {
        return (
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <h3 className="mb-2 text-lg font-medium">{formData.title || 'Poll Title'}</h3>
                {formData.description && <p className="mb-4 text-sm text-gray-400">{formData.description}</p>}

                <div className="space-y-2">
                    {formData.type === 'yes_no' ? (
                        <div className="flex gap-2">
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-green-500/20 py-2 text-green-400 hover:bg-green-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                Yes
                            </button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-500/20 py-2 text-red-400 hover:bg-red-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                </svg>
                                No
                            </button>
                        </div>
                    ) : (
                        formData.options.map((option, index) => (
                            <button
                                key={index}
                                className={`w-full rounded-md px-4 py-2 text-left transition hover:opacity-90 ${
                                    option.color ? `bg-[${option.color}]/20 text-[${option.color}]` : 'bg-gray-700 text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon && renderIconPreview(option.icon)}
                                    <span>{option.title || `Option ${index + 1}`}</span>
                                </div>
                                {option.description && <div className="mt-1 text-sm opacity-70">{option.description}</div>}
                            </button>
                        ))
                    )}

                    {formData.allow_custom && (
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Other (specify)"
                                className="w-full rounded-md bg-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                disabled
                            />
                        </div>
                    )}
                </div>

                {formData.show_results_without_voting && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-400">Results Preview</h4>
                        <div className="space-y-3">
                            {formData.type === 'yes_no' ? (
                                <>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Yes</span>
                                            <span className="text-sm">70%</span>
                                        </div>
                                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-700">
                                            <div className="h-full w-[70%] bg-green-500"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">No</span>
                                            <span className="text-sm">30%</span>
                                        </div>
                                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-700">
                                            <div className="h-full w-[30%] bg-red-500"></div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                formData.options.map((option, index) => {
                                    const percentage = 100 / formData.options.length;
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">{option.title || `Option ${index + 1}`}</span>
                                                <span className="text-sm">{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-700">
                                                <div
                                                    className="h-full bg-purple-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: option.color || '#8847BB',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Poll" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Create New Poll</h1>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Form Column */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2">
                        <div className="space-y-6 rounded-xl bg-gray-800 p-6">
                            {/* Basic Information */}
                            <div>
                                <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Poll Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => updateFormData('title', e.target.value)}
                                            className="w-full rounded-md bg-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Description (Optional)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => updateFormData('description', e.target.value)}
                                            className="w-full rounded-md bg-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            rows={3}
                                        />
                                        <p className="mt-1 text-xs text-gray-400">Provide additional context or instructions for the poll</p>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Poll Type *</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => updateFormData('type', e.target.value)}
                                            className="w-full rounded-md bg-gray-700 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="yes_no">Yes/No Question</option>
                                            <option value="multiple_choice">Multiple Choice</option>
                                            <option value="ranking">Ranking</option>
                                            <option value="custom_input">Custom Input</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            {formData.type !== 'yes_no' && (
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Poll Options</h2>
                                        <button
                                            type="button"
                                            onClick={addOption}
                                            className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                        >
                                            Add Option
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.options.map((option, index) => (
                                            <div key={index} className="rounded-md bg-gray-700 p-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">Option {index + 1}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(index)}
                                                        className="rounded-md bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                                                        disabled={formData.options.length <= 2}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className="mt-2 space-y-3">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium">Title *</label>
                                                        <input
                                                            type="text"
                                                            value={option.title}
                                                            onChange={(e) => updateOption(index, 'title', e.target.value)}
                                                            className="w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="mb-1 block text-xs font-medium">Color</label>
                                                            <select
                                                                value={option.color || ''}
                                                                onChange={(e) => updateOption(index, 'color', e.target.value || undefined)}
                                                                className="w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                            >
                                                                {colorOptions.map((color) => (
                                                                    <option key={color.name} value={color.value || ''}>
                                                                        {color.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-xs font-medium">Icon</label>
                                                            <select
                                                                value={option.icon || ''}
                                                                onChange={(e) => updateOption(index, 'icon', e.target.value || undefined)}
                                                                className="w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                            >
                                                                {iconOptions.map((icon) => (
                                                                    <option key={icon.name} value={icon.value || ''}>
                                                                        {icon.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium">Description (Optional)</label>
                                                        <input
                                                            type="text"
                                                            value={option.description || ''}
                                                            onChange={(e) => updateOption(index, 'description', e.target.value)}
                                                            className="w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Poll Settings */}
                            <div>
                                <h2 className="mb-4 text-lg font-semibold">Poll Settings</h2>

                                <div className="space-y-3">
                                    {formData.type !== 'yes_no' && formData.type !== 'ranking' && (
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="allow_multiple"
                                                    type="checkbox"
                                                    checked={formData.allow_multiple}
                                                    onChange={(e) => updateFormData('allow_multiple', e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="allow_multiple" className="font-medium">
                                                    Allow multiple selections
                                                </label>
                                                <p className="text-xs text-gray-400">Voters can choose more than one option</p>
                                            </div>
                                        </div>
                                    )}

                                    {formData.type !== 'yes_no' && formData.type !== 'ranking' && (
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="allow_custom"
                                                    type="checkbox"
                                                    checked={formData.allow_custom}
                                                    onChange={(e) => updateFormData('allow_custom', e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="allow_custom" className="font-medium">
                                                    Allow custom answers
                                                </label>
                                                <p className="text-xs text-gray-400">Voters can submit their own answers</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="show_results_without_voting"
                                                type="checkbox"
                                                checked={formData.show_results_without_voting}
                                                onChange={(e) => updateFormData('show_results_without_voting', e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="show_results_without_voting" className="font-medium">
                                                Show results without voting
                                            </label>
                                            <p className="text-xs text-gray-400">Allow visitors to see results without casting a vote</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => updateFormData('is_active', e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="is_active" className="font-medium">
                                                Active poll
                                            </label>
                                            <p className="text-xs text-gray-400">Poll will be visible and accepting votes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="border-t border-gray-700 pt-4">
                                <div className="flex justify-end">
                                    <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                        Create Poll
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Preview Column */}
                    <div className="space-y-4">
                        <div className="rounded-xl bg-gray-800 p-6">
                            <h2 className="mb-4 text-lg font-semibold">Preview</h2>
                            <PollPreview />
                        </div>

                        <div className="rounded-xl bg-gray-800 p-6">
                            <h2 className="mb-4 text-lg font-semibold">Poll Tips</h2>
                            <ul className="list-inside list-disc space-y-2 text-sm text-gray-400">
                                <li>Keep poll questions clear and concise</li>
                                <li>Use different colors for better visual differentiation</li>
                                <li>For ranking polls, limit options to 5 or fewer</li>
                                <li>Consider showing results without voting for higher engagement</li>
                                <li>Use custom answers when you want open-ended feedback</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
