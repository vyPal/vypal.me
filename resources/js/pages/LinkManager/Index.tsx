import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type SubLink = {
    id?: number;
    title: string;
    url: string;
};

type Link = {
    id?: number;
    title: string;
    type: LinkType;
    url?: string;
    description?: string;
    sublinks?: SubLink[];
    order?: number;
};

enum LinkType {
    Website = 'website',
    Blog = 'blog',
    Social = 'social',
    Code = 'code',
    Other = 'other',
    Separator = 'separator',
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Link Manager',
        href: '/dashboard/links',
    },
];

export default function LinkManager({ links }: { links: Link[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLink, setCurrentLink] = useState<Link | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    // Form state for creating/editing links
    const [formData, setFormData] = useState<Link>({
        title: '',
        type: LinkType.Website,
        url: '',
        description: '',
        sublinks: [],
    });

    // Update form field
    const updateField = (field: keyof Link, value: Link[keyof Link]) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Add a new sublink
    const addSublink = () => {
        setFormData({
            ...formData,
            sublinks: [...(formData.sublinks || []), { title: '', url: '' }],
        });
    };

    // Update a sublink
    const updateSublink = (index: number, field: keyof SubLink, value: string) => {
        const updatedSublinks = [...(formData.sublinks || [])];
        updatedSublinks[index] = {
            ...updatedSublinks[index],
            [field]: value,
        };

        setFormData({
            ...formData,
            sublinks: updatedSublinks,
        });
    };

    // Remove a sublink
    const removeSublink = (index: number) => {
        const updatedSublinks = [...(formData.sublinks || [])];
        updatedSublinks.splice(index, 1);

        setFormData({
            ...formData,
            sublinks: updatedSublinks,
        });
    };

    // Open create modal
    const openCreateModal = () => {
        setFormMode('create');
        setFormData({
            title: '',
            type: LinkType.Website,
            url: '',
            description: '',
            sublinks: [],
        });
        setIsModalOpen(true);
    };

    // Open edit modal
    const openEditModal = (link: Link) => {
        setFormMode('edit');
        setCurrentLink(link);
        setFormData({
            id: link.id,
            title: link.title,
            type: link.type,
            url: link.url || '',
            description: link.description || '',
            sublinks: link.sublinks || [],
        });
        setIsModalOpen(true);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formMode === 'create') {
            router.post(route('links.store'), formData);
        } else {
            if (!currentLink) return;
            router.put(route('links.update', currentLink.id), formData);
        }

        setIsModalOpen(false);
    };

    // Handle link deletion
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this link?')) {
            router.delete(route('links.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Link Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Link Manager</h1>
                    <button onClick={openCreateModal} className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                        Add New Link
                    </button>
                </div>

                <div className="rounded-xl bg-gray-800 p-4">
                    {links.length === 0 ? (
                        <div className="py-8 text-center text-gray-400">No links created yet. Click "Add New Link" to get started.</div>
                    ) : (
                        <div className="space-y-4">
                            {links.map((link) => (
                                <div key={link.id} className="flex items-center justify-between rounded-lg bg-gray-700 p-4">
                                    <div>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="text-sm text-gray-400">
                                            Type: {link.type}
                                            {link.sublinks && link.sublinks.length > 0 && ` • ${link.sublinks.length} sublinks`}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(link)}
                                            className="rounded-md bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(link.id!)}
                                            className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal for creating/editing links */}
                {isModalOpen && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-gray-800 p-6">
                            <h2 className="mb-4 text-xl font-bold">{formMode === 'create' ? 'Add New Link' : 'Edit Link'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title field */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        className="w-full rounded-md bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Type field */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => updateField('type', e.target.value)}
                                        className="w-full rounded-md bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value={LinkType.Website}>Website</option>
                                        <option value={LinkType.Blog}>Blog</option>
                                        <option value={LinkType.Social}>Social</option>
                                        <option value={LinkType.Code}>Code</option>
                                        <option value={LinkType.Other}>Other</option>
                                        <option value={LinkType.Separator}>Separator</option>
                                    </select>
                                </div>

                                {/* URL field - only if not separator */}
                                {formData.type !== LinkType.Separator && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">URL</label>
                                        <input
                                            type="url"
                                            value={formData.url}
                                            onChange={(e) => updateField('url', e.target.value)}
                                            className="w-full rounded-md bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required={false}
                                        />
                                    </div>
                                )}

                                {/* Description field - only if not separator */}
                                {formData.type !== LinkType.Separator && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Description (optional)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            className="w-full rounded-md bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            rows={2}
                                        />
                                    </div>
                                )}

                                {/* Sublinks section - only if not separator */}
                                {formData.type !== LinkType.Separator && (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium">Sublinks</label>
                                            <button
                                                type="button"
                                                onClick={addSublink}
                                                className="rounded-md bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600"
                                            >
                                                + Add Sublink
                                            </button>
                                        </div>

                                        {formData.sublinks && formData.sublinks.length > 0 ? (
                                            <div className="mt-2 space-y-3">
                                                {formData.sublinks.map((sublink, index) => (
                                                    <div key={index} className="flex space-x-2">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Title"
                                                                value={sublink.title}
                                                                onChange={(e) => updateSublink(index, 'title', e.target.value)}
                                                                className="w-full rounded-md bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="url"
                                                                placeholder="URL"
                                                                value={sublink.url}
                                                                onChange={(e) => updateSublink(index, 'url', e.target.value)}
                                                                className="w-full rounded-md bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                                required
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSublink(index)}
                                                            className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="mt-2 text-sm text-gray-400">No sublinks added yet. Click "+ Add Sublink" to add one.</div>
                                        )}
                                    </div>
                                )}

                                {/* Form actions */}
                                <div className="flex justify-end space-x-2 border-t border-gray-700 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                        {formMode === 'create' ? 'Create Link' : 'Update Link'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Link ordering feature */}
                {links.length > 0 && (
                    <div className="mt-4 rounded-xl bg-gray-800 p-4">
                        <h2 className="mb-4 text-lg font-semibold">Manage Link Order</h2>
                        <div className="space-y-2">
                            {links.map((link, index) => (
                                <div key={link.id} className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                                    <div className="flex items-center">
                                        <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-sm">
                                            {index + 1}
                                        </span>
                                        <span>{link.title}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => {
                                                if (index > 0) {
                                                    const reorderedLinks = [...links];
                                                    [reorderedLinks[index], reorderedLinks[index - 1]] = [
                                                        reorderedLinks[index - 1],
                                                        reorderedLinks[index],
                                                    ];

                                                    const linkOrders = reorderedLinks.map((l, i) => ({
                                                        id: l.id,
                                                        order: i + 1,
                                                    }));

                                                    router.post(route('links.reorder'), { links: linkOrders });
                                                }
                                            }}
                                            disabled={index === 0}
                                            className={`rounded-md p-1 ${index === 0 ? 'cursor-not-allowed text-gray-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (index < links.length - 1) {
                                                    const reorderedLinks = [...links];
                                                    [reorderedLinks[index], reorderedLinks[index + 1]] = [
                                                        reorderedLinks[index + 1],
                                                        reorderedLinks[index],
                                                    ];

                                                    const linkOrders = reorderedLinks.map((l, i) => ({
                                                        id: l.id,
                                                        order: i + 1,
                                                    }));

                                                    router.post(route('links.reorder'), { links: linkOrders });
                                                }
                                            }}
                                            disabled={index === links.length - 1}
                                            className={`rounded-md p-1 ${index === links.length - 1 ? 'cursor-not-allowed text-gray-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                                        >
                                            ↓
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
