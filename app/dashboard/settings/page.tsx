"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Pencil, Save, User, X } from "lucide-react";

type ProfileForm = {
  displayName: string;
  email: string;
  phone: string;
  title: string;
  companyName: string;
  billingEmail: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  timezone: string;
  role: string;
};

const emptyForm: ProfileForm = {
  displayName: "",
  email: "",
  phone: "",
  title: "",
  companyName: "",
  billingEmail: "",
  website: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  timezone: "",
  role: "",
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
      <p className="text-sm font-medium text-white/45">{label}</p>
      <p className="text-sm text-white">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [originalForm, setOriginalForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/settings/profile", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        const nextForm: ProfileForm = {
          ...emptyForm,
          ...data.profile,
        };

        setForm(nextForm);
        setOriginalForm(nextForm);
      } catch (err: any) {
        setError(err.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const hasChanges = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  }, [form, originalForm]);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function cancelUserEdit() {
    setForm((prev) => ({
      ...prev,
      displayName: originalForm.displayName,
      phone: originalForm.phone,
      title: originalForm.title,
    }));
    setEditingUser(false);
    setMessage("");
    setError("");
  }

  function cancelCompanyEdit() {
    setForm((prev) => ({
      ...prev,
      companyName: originalForm.companyName,
      billingEmail: originalForm.billingEmail,
      website: originalForm.website,
      addressLine1: originalForm.addressLine1,
      addressLine2: originalForm.addressLine2,
      city: originalForm.city,
      state: originalForm.state,
      postalCode: originalForm.postalCode,
      country: originalForm.country,
      timezone: originalForm.timezone,
    }));
    setEditingCompany(false);
    setMessage("");
    setError("");
  }

  async function saveAll() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: form.displayName,
          phone: form.phone,
          title: form.title,
          companyName: form.companyName,
          billingEmail: form.billingEmail,
          website: form.website,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          timezone: form.timezone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      setOriginalForm(form);
      setEditingUser(false);
      setEditingCompany(false);
      setMessage("Settings updated successfully.");
    } catch (err: any) {
      setError(err.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/60">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Profile & Company
        </h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Review your account details and company information, then edit only what
          needs to be changed.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
              <User className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">User Details</h2>
              <p className="text-sm text-white/45">
                Your personal profile and contact information
              </p>
            </div>
          </div>

          {!editingUser ? (
            <button
              type="button"
              onClick={() => {
                setEditingUser(true);
                setMessage("");
                setError("");
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition hover:border-violet-400/40 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelUserEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        {!editingUser ? (
          <div className="mt-6 space-y-4">
            <DetailRow label="Full Name" value={form.displayName} />
            <DetailRow label="Email" value={form.email} />
            <DetailRow label="Phone" value={form.phone} />
            <DetailRow label="Job Title" value={form.title} />
            <DetailRow label="Role" value={form.role} />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Full Name
              </label>
              <input
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                value={form.email}
                disabled
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-white/50"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Phone"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Job Title
              </label>
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Job title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Role
              </label>
              <input
                value={form.role}
                disabled
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-white/50"
                placeholder="Role"
              />
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
              <Building2 className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Company Details</h2>
              <p className="text-sm text-white/45">
                Billing and business information for your account
              </p>
            </div>
          </div>

          {!editingCompany ? (
            <button
              type="button"
              onClick={() => {
                setEditingCompany(true);
                setMessage("");
                setError("");
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition hover:border-violet-400/40 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelCompanyEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        {!editingCompany ? (
          <div className="mt-6 space-y-4">
            <DetailRow label="Company Name" value={form.companyName} />
            <DetailRow label="Billing Email" value={form.billingEmail} />
            <DetailRow label="Website" value={form.website} />
            <DetailRow label="Address Line 1" value={form.addressLine1} />
            <DetailRow label="Address Line 2" value={form.addressLine2} />
            <DetailRow label="City" value={form.city} />
            <DetailRow label="State" value={form.state} />
            <DetailRow label="Postal Code" value={form.postalCode} />
            <DetailRow label="Country" value={form.country} />
            <DetailRow label="Timezone" value={form.timezone} />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Company Name
              </label>
              <input
                value={form.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Company name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Billing Email
              </label>
              <input
                value={form.billingEmail}
                onChange={(e) => updateField("billingEmail", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Billing email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Website
              </label>
              <input
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Website"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Address Line 1
              </label>
              <input
                value={form.addressLine1}
                onChange={(e) => updateField("addressLine1", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Address line 1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Address Line 2
              </label>
              <input
                value={form.addressLine2}
                onChange={(e) => updateField("addressLine2", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Address line 2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                City
              </label>
              <input
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="City"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                State
              </label>
              <input
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="State"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Postal Code
              </label>
              <input
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Postal code"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Country
              </label>
              <input
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Country"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/80">
                Timezone
              </label>
              <input
                value={form.timezone}
                onChange={(e) => updateField("timezone", e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                placeholder="Timezone"
              />
            </div>
          </div>
        )}
      </section>

      {(editingUser || editingCompany) && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.08] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Unsaved changes</p>
              <p className="text-sm text-white/60">
                Save your updates when you are finished editing.
              </p>
            </div>

            <button
              type="button"
              onClick={saveAll}
              disabled={saving || !hasChanges}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {message ? (
        <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}
    </div>
  );
}