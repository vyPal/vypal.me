import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface BacklogLink {
    id: number;
    title: string;
    url: string;
    [key: string]: string | number | undefined;
}

interface BacklogItem {
    id: number;
    title: string;
    type: 'website' | 'blog' | 'social' | 'code' | 'other' | 'separator';
    url?: string;
    description?: string;
    sublinks?: BacklogLink[];
    [key: string]: number | string | ('website' | 'blog' | 'social' | 'code' | 'other' | 'separator') | BacklogLink[] | undefined;
}

interface AvailabilitySettings {
    available_from: string | null;
    available_until: string | null;
    is_available_now: boolean;
    busy_message: string;
    available_message: string;
    project_backlog: BacklogItem[] | null;
}

// Define form data interface to satisfy TypeScript
interface AvailabilityFormData {
    available_from: string;
    available_until: string;
    is_available_now: boolean;
    busy_message: string;
    available_message: string;
    project_backlog: BacklogItem[];
}

interface Props {
    settings: AvailabilitySettings;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Availability',
        href: '/admin/availability',
    },
];

export default function Edit({ settings }: Props) {
    const [backlogItems, setBacklogItems] = useState<BacklogItem[]>(settings.project_backlog || []);

    const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
    const [newSublink, setNewSublink] = useState<{ title: string; url: string }>({ title: '', url: '' });

    // Fix form type issues by specifying the form data type
    const { data, setData, post, processing, errors } = useForm<Required<AvailabilityFormData>>({
        available_from: settings.available_from || '',
        available_until: settings.available_until || '',
        is_available_now: settings.is_available_now,
        busy_message: settings.busy_message,
        available_message: settings.available_message,
        project_backlog: settings.project_backlog || [],
    });

    const createNewItem = () => {
        const newItem: BacklogItem = {
            id: Date.now(),
            title: '',
            type: 'other',
            description: '',
            sublinks: [],
        };

        setEditingItem(newItem);
    };

    const editItem = (item: BacklogItem) => {
        setEditingItem({ ...item });
    };

    const saveItem = () => {
        if (!editingItem) return;

        // Validate item has at least a title
        if (!editingItem.title.trim() && editingItem.type !== 'separator') {
            alert('Please provide a title for the item');
            return;
        }

        const updatedItems = backlogItems.find((item) => item.id === editingItem.id)
            ? backlogItems.map((item) => (item.id === editingItem.id ? editingItem : item))
            : [...backlogItems, editingItem];

        setBacklogItems(updatedItems);

        // Fix the TypeScript issue by casting the data
        setData('project_backlog', updatedItems);
        setEditingItem(null);
    };

    const removeItem = (id: number) => {
        const updatedItems = backlogItems.filter((item) => item.id !== id);
        setBacklogItems(updatedItems);
        // Fix the TypeScript issue by casting the data
        setData('project_backlog', updatedItems);
    };

    const addSublink = () => {
        if (!editingItem) return;
        if (!newSublink.title.trim() || !newSublink.url.trim()) {
            alert('Please provide both title and URL for the sublink');
            return;
        }

        const newSublinks = [
            ...(editingItem.sublinks || []),
            {
                id: Date.now(),
                title: newSublink.title,
                url: newSublink.url,
            },
        ];

        setEditingItem({
            ...editingItem,
            sublinks: newSublinks,
        });

        setNewSublink({ title: '', url: '' });
    };

    const removeSublink = (id: number) => {
        if (!editingItem?.sublinks) return;

        const updatedSublinks = editingItem.sublinks.filter((link) => link.id !== id);

        setEditingItem({
            ...editingItem,
            sublinks: updatedSublinks,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.availability.update'));
    };

    const moveItemUp = (index: number) => {
        if (index === 0) return;
        const updatedItems = [...backlogItems];
        [updatedItems[index], updatedItems[index - 1]] = [updatedItems[index - 1], updatedItems[index]];
        setBacklogItems(updatedItems);
        // Fix the TypeScript issue by casting the data
        setData('project_backlog', updatedItems);
    };

    const moveItemDown = (index: number) => {
        if (index === backlogItems.length - 1) return;
        const updatedItems = [...backlogItems];
        [updatedItems[index], updatedItems[index + 1]] = [updatedItems[index + 1], updatedItems[index]];
        setBacklogItems(updatedItems);
        // Fix the TypeScript issue by casting the data
        setData('project_backlog', updatedItems);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Availability Settings" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Manage <span className="text-[#8847BB] dark:text-[#F9BAEE]">Availability</span>
                    </h1>
                    <p className="mt-2 text-[#706f6c] dark:text-[#A1A09A]">
                        Configure when you're available and what projects you're currently working on.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <Card>
                        <CardHeader>
                            <CardTitle>Availability Status</CardTitle>
                            <CardDescription>Set your availability manually or using date ranges</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={Boolean(data.is_available_now)}
                                        onCheckedChange={(checked) => setData('is_available_now', checked)}
                                        id="is-available"
                                    />
                                    <Label htmlFor="is-available" className="font-medium">
                                        I'm available now (override date settings)
                                    </Label>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="available-from">Available From</Label>
                                        <Input
                                            id="available-from"
                                            type="datetime-local"
                                            value={data.available_from || ''}
                                            onChange={(e) => setData('available_from', e.target.value)}
                                            className="mt-1"
                                        />
                                        {errors.available_from && <p className="mt-1 text-sm text-red-500">{errors.available_from}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="available-until">Available Until (Optional)</Label>
                                        <Input
                                            id="available-until"
                                            type="datetime-local"
                                            value={data.available_until || ''}
                                            onChange={(e) => setData('available_until', e.target.value)}
                                            className="mt-1"
                                        />
                                        {errors.available_until && <p className="mt-1 text-sm text-red-500">{errors.available_until}</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Messages</CardTitle>
                            <CardDescription>What visitors will see when checking your availability</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="busy-message">Busy Message (displayed when you're not available)</Label>
                                    <Textarea
                                        id="busy-message"
                                        value={data.busy_message || ''}
                                        onChange={(e) => setData('busy_message', e.target.value)}
                                        className="mt-1 resize-none"
                                        rows={2}
                                    />
                                    {errors.busy_message && <p className="mt-1 text-sm text-red-500">{errors.busy_message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="available-message">Available Message (displayed when you're available)</Label>
                                    <Textarea
                                        id="available-message"
                                        value={data.available_message || ''}
                                        onChange={(e) => setData('available_message', e.target.value)}
                                        className="mt-1 resize-none"
                                        rows={2}
                                    />
                                    {errors.available_message && <p className="mt-1 text-sm text-red-500">{errors.available_message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Project Backlog</CardTitle>
                                <CardDescription>Show what you're currently working on</CardDescription>
                            </div>
                            <Button
                                type="button"
                                onClick={createNewItem}
                                size="sm"
                                className="bg-[#8847BB] hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                            >
                                <Plus className="mr-1 h-4 w-4" /> Add Item
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {backlogItems.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-center">
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        No items in your backlog. Add some to show visitors what you're working on.
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {backlogItems.map((item, index) => (
                                        <li key={item.id} className="bg-card flex items-center justify-between rounded-lg border p-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center">
                                                    <div className="mr-2">
                                                        {item.type === 'separator' ? (
                                                            <Badge className="bg-gray-500">Separator</Badge>
                                                        ) : (
                                                            <Badge
                                                                className={
                                                                    item.type === 'website'
                                                                        ? 'bg-blue-600'
                                                                        : item.type === 'blog'
                                                                          ? 'bg-green-600'
                                                                          : item.type === 'social'
                                                                            ? 'bg-purple-600'
                                                                            : item.type === 'code'
                                                                              ? 'bg-amber-600'
                                                                              : 'bg-gray-600'
                                                                }
                                                            >
                                                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="truncate font-medium">{item.title || '[No title]'}</h3>
                                                </div>
                                                {item.description && (
                                                    <p className="mt-1 truncate text-sm text-[#706f6c] dark:text-[#A1A09A]">{item.description}</p>
                                                )}
                                                {item.sublinks && item.sublinks.length > 0 && (
                                                    <div className="mt-1 flex items-center space-x-2">
                                                        <span className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                            {item.sublinks.length} sublink{item.sublinks.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex items-center space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => moveItemUp(index)}
                                                    disabled={index === 0}
                                                >
                                                    ↑
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => moveItemDown(index)}
                                                    disabled={index === backlogItems.length - 1}
                                                >
                                                    ↓
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => editItem(item)}>
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Item Editor Dialog */}
                            {editingItem && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
                                        <h3 className="mb-4 text-lg font-medium">{editingItem.id ? 'Edit Item' : 'Add New Item'}</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="item-type">Item Type</Label>
                                                <Select
                                                    value={editingItem.type}
                                                    onValueChange={(value: 'website' | 'blog' | 'social' | 'code' | 'other' | 'separator') =>
                                                        setEditingItem({ ...editingItem, type: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="website">Website</SelectItem>
                                                        <SelectItem value="blog">Blog</SelectItem>
                                                        <SelectItem value="social">Social</SelectItem>
                                                        <SelectItem value="code">Code</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                        <SelectItem value="separator">Separator</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="item-title">Title</Label>
                                                <Input
                                                    id="item-title"
                                                    value={editingItem.title}
                                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                                    placeholder="Item title"
                                                />
                                            </div>

                                            {editingItem.type !== 'separator' && (
                                                <>
                                                    <div>
                                                        <Label htmlFor="item-url">URL (Optional)</Label>
                                                        <Input
                                                            id="item-url"
                                                            value={editingItem.url || ''}
                                                            onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                                                            placeholder="https://example.com"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="item-description">Description (Optional)</Label>
                                                        <Textarea
                                                            id="item-description"
                                                            value={editingItem.description || ''}
                                                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                                            placeholder="Brief description"
                                                            rows={2}
                                                            className="resize-none"
                                                        />
                                                    </div>

                                                    {/* Sublinks Section */}
                                                    <div className="mt-4 border-t pt-4">
                                                        <h4 className="mb-2 font-medium">Sublinks</h4>

                                                        {editingItem.sublinks && editingItem.sublinks.length > 0 ? (
                                                            <ul className="mb-4 space-y-2">
                                                                {editingItem.sublinks.map((link) => (
                                                                    <li key={link.id} className="flex items-center justify-between">
                                                                        <div>
                                                                            <div className="font-medium">{link.title}</div>
                                                                            <div className="truncate text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                                                                {link.url}
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onClick={() => removeSublink(link.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="mb-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">No sublinks added yet.</p>
                                                        )}

                                                        <div className="space-y-2">
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <div className="col-span-1">
                                                                    <Input
                                                                        value={newSublink.title}
                                                                        onChange={(e) => setNewSublink({ ...newSublink, title: e.target.value })}
                                                                        placeholder="Link Title"
                                                                    />
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <div className="flex space-x-2">
                                                                        <Input
                                                                            value={newSublink.url}
                                                                            onChange={(e) => setNewSublink({ ...newSublink, url: e.target.value })}
                                                                            placeholder="https://example.com"
                                                                            className="flex-1"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            onClick={addSublink}
                                                                            size="sm"
                                                                            className="bg-[#8847BB] hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                                                                        >
                                                                            Add
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-2">
                                            <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={saveItem}
                                                className="bg-[#8847BB] hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                                            >
                                                Save Item
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#8847BB] hover:bg-[#7838a6] dark:bg-[#5E4290] dark:hover:bg-[#4e3578]"
                            size="lg"
                        >
                            {processing ? 'Saving...' : 'Save Availability Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
