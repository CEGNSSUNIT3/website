'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  createActivity,
  uploadPhoto,
  addPhoto,
  getActivities,
  deleteActivity,
} from '@/lib/supabase';
import { Activity } from '@/types';
import {
  Plus,
  Trash2,
  Upload,
  LogOut,
  LayoutDashboard,
  ImageIcon,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('nss_admin_auth')) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data ?? []);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !date) {
      toast.error('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create activity
      const activity = await createActivity(title, description, date);

      // 2. Upload photos
      for (const file of files) {
        const path = `${activity.id}/${Date.now()}-${file.name}`;
        const url = await uploadPhoto(file, path);
        await addPhoto(activity.id, url);
      }

      toast.success('Activity posted successfully!');
      setTitle('');
      setDescription('');
      setDate('');
      setFiles([]);
      setPreviews([]);
      fetchActivities();
      setActiveTab('manage');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this activity and all its photos?')) return;
    try {
      await deleteActivity(id);
      toast.success('Activity deleted');
      fetchActivities();
    } catch {
      toast.error('Delete failed');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('nss_admin_auth');
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-nss-green to-nss-blue text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} />
          <div>
            <p className="font-bold text-base">Admin Dashboard</p>
            <p className="text-green-100 text-xs">NSS Unit · CEG</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Activities', value: activities.length, color: 'text-nss-green' },
            {
              label: 'Total Photos',
              value: activities.reduce((a, b) => a + (b.photos?.length ?? 0), 0),
              color: 'text-nss-blue',
            },
            { label: 'This Year', value: activities.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length, color: 'text-nss-maroon' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit shadow-sm">
          {[
            { id: 'add', icon: Plus, label: 'Add Activity' },
            { id: 'manage', icon: LayoutDashboard, label: 'Manage' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-nss-green text-white shadow'
                    : 'text-gray-500 hover:text-nss-green'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Add Activity Form */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-gray-800 mb-6">
              Post New Activity
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Blood Donation Camp 2024"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-nss-green/30 focus:border-nss-green transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-nss-green/30 focus:border-nss-green transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the activity, impact, volunteers involved..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-nss-green/30 focus:border-nss-green transition-all resize-none"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <ImageIcon size={14} className="inline mr-1" />
                  Photos (optional)
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-nss-green transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload photos or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB each</p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {previews.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={url} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} /> Post Activity
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Manage Activities */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-nss-green border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && activities.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <AlertTriangle size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No activities yet. Add one!</p>
              </div>
            )}

            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4"
              >
                {/* Cover */}
                <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                  {activity.photos?.[0] ? (
                    <Image
                      src={activity.photos[0].image_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 leading-snug">{activity.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={11} />
                        {format(new Date(activity.date), 'dd MMMM yyyy')}
                        {activity.photos?.length ? (
                          <span className="ml-2 flex items-center gap-0.5">
                            <ImageIcon size={10} /> {activity.photos.length} photos
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                      title="Delete activity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
